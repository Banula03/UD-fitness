import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
    trainer_id: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    reason: string;
    status: "pending" | "approved" | "declined";
    createdAt: Date;
    updatedAt: Date;
}

const LeaveRequestSchema: Schema = new Schema({
    trainer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "declined"], default: "pending" }
}, { timestamps: true });

export default mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);
