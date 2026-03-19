import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product_id: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    member_id: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shipping_address: string;
    phone: string;
    payment_method: string;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    total_amount: number;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    member_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    shipping_address: { type: String, required: true },
    phone: { type: String, required: true },
    payment_method: { type: String, enum: ["COD", "CARD", "BANK"], default: "COD" },
    status: { type: String, enum: ["pending", "processing", "shipped", "delivered", "cancelled"], default: "pending" },
    total_amount: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IOrder>("Order", OrderSchema);
