import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRequest extends Document {
    trainer_id: mongoose.Types.ObjectId;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    createdAt: Date;
}

const LeaveRequestSchema: Schema = new Schema({
    trainer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    start_date: { type: String, required: true },
    end_date: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
}, { timestamps: true });

export default mongoose.model<ILeaveRequest>("LeaveRequest", LeaveRequestSchema);
