import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User";
import dotenv from "dotenv";

dotenv.config();

async function test() {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to DB");

    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
        console.log("Usage: npx ts-node test-login.ts <email> <password>");
        process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
        console.log("User not found in DB:", email);
    } else {
        console.log("User found:", user.email);
        console.log("Stored Hash:", user.password);
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Password Match Result:", isMatch);
    }

    await mongoose.disconnect();
}

test();
