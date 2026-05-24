// Order Modal
import mongoose, {model, models, Schema} from "mongoose";
import {ImageVariant, ImageVariantType} from "./Product";

interface PopulatedUser {
    _id: mongoose.Types.ObjectId;
    email: string;
}

interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
}

export enum OrderStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}

export interface IOrder {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    variant: ImageVariant;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    status: OrderStatus;
    downloadUrl?: string;
    previewUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const orderSchema = new Schema<IOrder>(
    {
        userId: {type: Schema.Types.ObjectId, ref: "User", required: true},
        productId: {type: Schema.Types.ObjectId, ref: "Product", required: true},
        variant: {
            type: {
                type: String,
                required: true,
                enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
                set: (v: string) => v.toUpperCase(),
            },
            price: {type: Number, required: true},
            license: {
                type: String,
                required: true,
                enum: ["personal", "commercial"],
            },
        },
        razorpayOrderId: {type: String, required: true},
        razorpayPaymentId: {type: String},
        amount: {type: Number, required: true},
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.PENDING,
        },
        downloadUrl: {type: String},
        previewUrl: {type: String},
    },
    {timestamps: true}
);

orderSchema.index({razorpayOrderId: 1}, {unique: true});
orderSchema.index({userId: 1, createdAt: -1});

const Order = models?.Order || model<IOrder>("Order", orderSchema);
export default Order;
