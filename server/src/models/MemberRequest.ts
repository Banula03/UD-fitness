import mongoose, { Schema, Document } from "mongoose";

export interface IMemberRequest extends Document {
    member_id: mongoose.Types.ObjectId;
    trainer_id: mongoose.Types.ObjectId;
    request_text: string;
    reply_text: string;
    status: string;
    createdAt: Date;
}

const MemberRequestSchema: Schema = new Schema({
    member_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trainer_id: { type: Schema.Types.ObjectId, ref: "User" },
    request_text: { type: String, required: true },
    reply_text: { type: String, default: "" },
    status: { type: String, enum: ["pending", "replied"], default: "pending" }
}, { timestamps: true });

export default mongoose.model<IMemberRequest>("MemberRequest", MemberRequestSchema);
