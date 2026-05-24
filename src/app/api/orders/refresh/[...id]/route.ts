import {withDatabase} from "@/lib/withDatabase";
import {NextRequest, NextResponse} from "next/server";
import Order, {OrderStatus} from "@/models/Order";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {getRazorpayClient} from "@/lib/razorpay";

type handlerParams = {
    params: Promise<{ id: string }>
}

async function handler(_req: NextRequest, {params}: handlerParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const {id} = (await params);
        if (!id) return NextResponse.json({error: "No such id"}, {
            status: 400
        });

        const orderRecord = await Order.findOne({razorpayOrderId: id.toString()});
        if (!orderRecord) {
            return NextResponse.json({error: "No such order"}, {status: 404});
        }

        if (session.user.role !== "admin" && orderRecord.userId.toString() !== session.user.id) {
            return NextResponse.json({error: "Forbidden"}, {status: 403});
        }

        const razorpay = getRazorpayClient();

        const pays = (await razorpay.orders.fetchPayments(id.toString())).items;

        if (!pays.length) {
            return NextResponse.json({error: "No payments found for this order"}, {status: 404});
        }

        const payObj = pays.reduce((newest, current) => current.created_at > newest.created_at ? current : newest);

        if (!payObj) {
            return NextResponse.json({error: "No payment found"}, {status: 404})
        }

        const updatePayload = {
            razorpayPaymentId: payObj.id,
            status: payObj.status === "captured" ? OrderStatus.COMPLETED : OrderStatus.FAILED,
        };

        if (payObj.status === "captured") {
            try {
                await Order.findOneAndUpdate({
                    razorpayOrderId: id.toString(),
                }, updatePayload)
                    .populate([
                        {path: "productId", select: "name", model: "Product"},
                        {path: "userId", select: "email", model: "User"}
                    ])

            } catch (e) {
                console.error("Populate Error: ", e);
                await Order.findOneAndUpdate(
                    {razorpayOrderId: id.toString()},
                    updatePayload
                )
            }
        }
        if (payObj.status === "failed") {
            try {
                await Order.findOneAndUpdate({
                    razorpayOrderId: id.toString(),
                }, updatePayload)
                    .populate([
                        {path: "productId", select: "name", model: "Product"},
                        {path: "userId", select: "email", model: "User"}
                    ])

            } catch (e) {
                console.error("Populate Error: ", e);
                await Order.findOneAndUpdate(
                    {razorpayOrderId: id.toString()},
                    updatePayload
                )
            }
        }

        return NextResponse.json({message: "Refreshed successfully!", success: true, pays}, {status: 200});
    } catch (e: any) {
        console.error("Error fetching order", e);
        return NextResponse.json({
            code: e.statusCode,
            error: e.message || e.error || "Failed to refresh",
            success: false
        }, {status: e.statusCode});
    }
}

export const GET = await withDatabase(handler);