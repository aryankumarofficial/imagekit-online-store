import {withDatabase} from "@/lib/withDatabase";
import {NextRequest, NextResponse} from "next/server";
import Product, {IProduct} from "@/models/Product";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {z} from "zod";

const productSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    // ImageKit returns a filePath (relative path) so accept non-empty strings
    imageUrl: z.string().min(1),
    variants: z.array(z.object({
        type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
        price: z.number().positive(),
        license: z.enum(["personal", "commercial"])
    })).min(1),
});

const handler = async () => {
    try {
        const products = await Product.find().lean();
        return NextResponse.json({
            products: products || [],
        }, {
            status: 200
        })
    } catch (e) {
        console.log(e);
        return NextResponse.json({
            error: "An error occurred while fetching products",
        }, {
            status: 500
        })
    }
}

const postHandler = async (request: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "admin") {
            return NextResponse.json({
                error: "Unauthorized",
            }, {
                status: 401
            })
        }
        const body = await request.json();
        const validation = productSchema.safeParse(body);

        if (!validation.success) {
             return NextResponse.json({
                error: "Invalid fields",
                details: validation.error.issues,
            }, {
                status: 400,
            })
        }

        const newProduct: IProduct = await Product.create(validation.data);
        return NextResponse.json({
            newProduct,
        }, {
            status: 201
        })
    } catch (e) {
        console.log(e)
        return NextResponse.json({
            error: "An error occurred",
        }, {
            status: 500
        })
    }
}

export const GET = await withDatabase(handler);
export const POST = await withDatabase(postHandler);