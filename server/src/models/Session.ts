import mongoose, { Schema, Document } from "mongoose";

export interface ISession extends Document {
    trainer_id: mongoose.Types.ObjectId;
    member_id: string; // Storing as string to match user's placeholder or can be ObjectId
    session_date: string;
    session_time: string;
    duration: string;
    type: string;
    status: string;
    createdAt: Date;
}

const SessionSchema: Schema = new Schema({
    trainer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    member_id: { type: String, required: true },
    session_date: { type: String, required: true },
    session_time: { type: String, required: true },
    duration: { type: String, default: "60" },
    type: { type: String, enum: ["personal", "group", "workshop"], default: "personal" },
    status: { type: String, default: "scheduled" }
}, { timestamps: true });

export default mongoose.model<ISession>("Session", SessionSchema);
