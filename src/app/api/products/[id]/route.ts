export const dynamic = 'force-dynamic'
import {NextRequest, NextResponse} from "next/server";
import {withDatabase} from "@/lib/withDatabase";
import Product from "@/models/Product";
import {z} from "zod";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {normalizeImagePath} from "@/lib/imagekit-url";

async function handler(
    _request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await props.params;

        const product = await Product.findById(id);

        if (!product) {
            return NextResponse.json({
                error: 'Product not found',
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            product
        }, {
            status: 200
        })

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: "An error occurred while trying to retrieve the product",
        }, {
            status: 500
        });
    }
}

export const GET = await withDatabase(handler);

const updateSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    imageUrl: z.string().min(1),
    variants: z.array(z.object({
        type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
        price: z.number().positive(),
        license: z.enum(["personal", "commercial"])
    })).min(1),
});

const putHandler = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await props.params;
        const body = await request.json();
        const validation = updateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid fields", details: validation.error.issues }, { status: 400 });
        }

        const updated = await Product.findByIdAndUpdate(id, {
            ...validation.data,
            imageUrl: normalizeImagePath(validation.data.imageUrl),
        }, { new: true });
        if (!updated) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product: updated }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "An error occurred while updating the product" }, { status: 500 });
    }
}

const deleteHandler = async (request: NextRequest, props: { params: Promise<{ id: string }> }) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await props.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "An error occurred while deleting the product" }, { status: 500 });
    }
}

export const PUT = await withDatabase(putHandler);
export const DELETE = await withDatabase(deleteHandler);