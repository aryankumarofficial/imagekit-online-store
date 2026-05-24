// /api/orders - CREATE ORDER

export const dynamic = 'force-dynamic'
import {NextRequest, NextResponse} from "next/server";
import {withDatabase} from "@/lib/withDatabase";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import {getRazorpayClient} from "@/lib/razorpay";
import {z} from "zod";

type ProductVariantRecord = {
    type: "SQUARE" | "WIDE" | "PORTRAIT";
    price: number;
    license: "personal" | "commercial";
};

type LeanProductRecord = {
    variants: ProductVariantRecord[];
};
const orderSchema = z.object({
    product_id: z.string().min(1),
    variant: z.object({
        type: z.enum(["SQUARE", "WIDE", "PORTRAIT"]),
        license: z.enum(["personal", "commercial"])
    })
});

async function handler(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({
                error: "Unauthorized"
            }, {
                status: 401
            })
        }

        const body = await req.json();
        const validation = orderSchema.safeParse(body);

        if (!validation.success) {
             return NextResponse.json({
                error: "Invalid fields",
                details: validation.error.issues
            }, {
                status: 400
            })
        }

        const {product_id, variant} = validation.data;
        const razorpay = getRazorpayClient();

        const product = await Product.findById(product_id).lean<LeanProductRecord>();
        if (!product) {
            return NextResponse.json({
                error: "Product not found"
            }, {
                status: 404
            });
        }

        const productVariant = product.variants.find(
            (item) => item.type === variant.type && item.license === variant.license
        );

        if (!productVariant) {
            return NextResponse.json({
                error: "Selected product variant is not available"
            }, {
                status: 400
            });
        }

        const amount = Math.round(productVariant.price * 100);

        const orderOptions = {
            amount,
            currency: "INR",
            receipt: `receipt-${product_id}-${variant.type}-${variant.license}`,
            notes: {
                productId: product_id,
                variantType: variant.type,
                variantLicense: variant.license,
            }, // take it seriously for filter purpose
        }

        // create razorpay Order
        const order = await razorpay.orders.create(orderOptions);

        const newOrder = await Order.create({
            userId: session.user.id,
            productId: product_id,
            variant: productVariant,
            razorpayOrderId: order.id,
            amount,
            status: "pending",
        });

        console.log("order ccc", newOrder)

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            dbOrderId: newOrder._id,
        }, {
            status: 201
        })

    } catch (err) {
        console.log(err);
        if (err instanceof Error && err.message.startsWith("Razorpay")) {
            return NextResponse.json({
                error: err.message,
            }, {
                status: 500,
            });
        }
        return NextResponse.json({
            error: "An error occurred",
        }, {
            status: 500
        })

    }
}

export const POST = await withDatabase(handler);