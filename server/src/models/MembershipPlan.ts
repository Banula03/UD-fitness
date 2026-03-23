import mongoose, { Schema, Document } from "mongoose";

export interface IMembershipPlan extends Document {
    name: string;
    description: string;
    price: number;
    durationInMonths: number;
    features: string[];
    isActive: boolean;
    createdAt: Date;
}

const MembershipPlanSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    durationInMonths: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model<IMembershipPlan>("MembershipPlan", MembershipPlanSchema);
