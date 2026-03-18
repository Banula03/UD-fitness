import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
    trainer_id: mongoose.Types.ObjectId;
    member_id: string;
    plan_details: string;
    createdAt: Date;
}

const MealPlanSchema: Schema = new Schema({
    trainer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    member_id: { type: String, required: true },
    plan_details: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
