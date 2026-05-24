// razorpay webhook

import {NextRequest, NextResponse} from "next/server";
import {withDatabase} from "@/lib/withDatabase";
import crypto from "crypto";
import Order, {OrderStatus} from "@/models/Order";
import {transporter} from "@/utils/mails/setup";

async function handler(request: NextRequest) {
    try {

        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature");

        const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET!)
            .update(body)
            .digest("hex")

        if (signature !== expectedSignature) {
            return NextResponse.json({
                error: "Invalid signature",
            }, {
                status: 400
            })
        }
        const event = JSON.parse(body);
        console.log("Events: ", event)
        if (event.event === "payment.captured") {
            const payment = event.payload.payment.entity;
            try {
                const existingOrder = await Order.findOne({razorpayOrderId: payment.order_id}).populate([
                    {path: "productId", select: "name", model: "Product"},
                    {path: "userId", select: "email", model: "User"}
                ]);

                if (existingOrder?.status === OrderStatus.COMPLETED && existingOrder.razorpayPaymentId === payment.id) {
                    return NextResponse.json({message: "Already processed"}, {status: 200});
                }

                const order = await Order.findOneAndUpdate({
                    razorpayOrderId: payment.order_id,
                }, {
                    razorpayPaymentId: payment.id,
                    status: OrderStatus.COMPLETED
                })
                    .populate([
                        {path: "productId", select: "name", model: "Product"},
                        {path: "userId", select: "email", model: "User"}
                    ])

                if (order && order.productId && order.userId) {
                    await transporter.verify();
                    await transporter.sendMail({
                        from: `Imagekit Responder<${process.env.GMAIL_USER}>`,
                        to: order.userId.email,
                        subject: "Oder Completed",
                        text: `Your order ${order.productId.name} has been successfully placed!`
                    })
                }
            } catch (e) {
                console.error("Populate Error: ", e);
                await Order.findOneAndUpdate(
                    {razorpayOrderId: payment.order_id},
                    {razorpayPaymentId: payment.id, status: OrderStatus.COMPLETED}
                )
            }
        }

        if (event.event === "payment.failed") {
            const payment = event.payload.payment.entity;
            try {
                const existingOrder = await Order.findOne({razorpayOrderId: payment.order_id}).populate([
                    {path: "productId", select: "name", model: "Product"},
                    {path: "userId", select: "email", model: "User"}
                ]);

                if (existingOrder?.status === OrderStatus.FAILED && existingOrder.razorpayPaymentId === payment.id) {
                    return NextResponse.json({message: "Already processed"}, {status: 200});
                }

                const order = await Order.findOneAndUpdate({
                    razorpayOrderId: payment.order_id,
                }, {
                    razorpayPaymentId: payment.id,
                    status: OrderStatus.FAILED
                })
                    .populate([
                        {path: "productId", select: "name", model: "Product"},
                        {path: "userId", select: "email", model: "User"}
                    ])

                if (order) {
                    await transporter.verify();
                    await transporter.sendMail({
                        from: `Imagekit Responder<${process.env.GMAIL_USER}>`,
                        to: order.userId.email,
                        subject: "Oder Failed",
                        text: `Your order ${order.productId.name} has been failed!`
                    })
                }
            } catch (e) {
                console.error("Populate Error: ", e);
                await Order.findOneAndUpdate(
                    {razorpayOrderId: payment.order_id}, {
                        razorpayPaymentId: payment.id,
                        status: OrderStatus.FAILED
                    }
                )
            }
        }

        return NextResponse.json({
            message: "Processed"
        }, {status: 200})

    } catch (e) {
        console.error("Critical webhook error:", e)

        return NextResponse.json({
            message: "Processed with An Error"
        }, {
            status: 200
        })
    }
}

export const POST = await withDatabase(handler);