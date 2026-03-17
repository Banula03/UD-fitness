import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "trainer" | "member";
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "trainer", "member"],
        default: "member"
    }
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);