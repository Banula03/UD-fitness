import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "trainer" | "member" | "staff" | "accountant";
    phone?: string;
    specialization?: string;
    status: "active" | "inactive";
}

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "trainer", "member", "staff", "accountant"],
        default: "member"
    },
    phone: { type: String },
    specialization: { type: String },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model<IUser>("User", userSchema);