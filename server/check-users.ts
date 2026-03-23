import mongoose from "mongoose";
import User from "./src/models/User";
import dotenv from "dotenv";

dotenv.config();

async function check() {
    await mongoose.connect(process.env.MONGO_URI!);
    const count = await User.countDocuments();
    const roles = await User.distinct("role");
    const sample = await User.findOne();
    
    console.log("Total Users in DB:", count);
    console.log("All Roles present:", roles);
    console.log("Sample User Body:", JSON.stringify(sample, null, 2));
    
    await mongoose.disconnect();
}

check();
