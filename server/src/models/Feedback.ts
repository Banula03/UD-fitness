import mongoose, { Schema, Document } from "mongoose";

export interface IFeedback extends Document {
    trainer_id: mongoose.Types.ObjectId;
    member_id: string; 
    content: string;
    createdAt: Date;
}

const FeedbackSchema: Schema = new Schema({
    trainer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    member_id: { type: String, required: true },
    content: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IFeedback>("Feedback", FeedbackSchema);
