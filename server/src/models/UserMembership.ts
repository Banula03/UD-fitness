import mongoose, { Schema, Document } from "mongoose";

export interface IUserMembership extends Document {
    user_id: mongoose.Types.ObjectId;
    plan_id: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    status: "active" | "expired" | "cancelled" | "pending";
    paymentStatus: "paid" | "unpaid";
    amountPaid: number;
    createdAt: Date;
}

const UserMembershipSchema: Schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plan_id: { type: Schema.Types.ObjectId, ref: "MembershipPlan", required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ["active", "expired", "cancelled", "pending"], 
        default: "active" 
    },
    paymentStatus: { 
        type: String, 
        enum: ["paid", "unpaid"], 
        default: "paid" 
    },
    amountPaid: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model<IUserMembership>("UserMembership", UserMembershipSchema);
