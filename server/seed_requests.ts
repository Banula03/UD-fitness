import mongoose from 'mongoose';
import MemberRequest from './src/models/MemberRequest';
import User from './src/models/User';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function seed() {
    await mongoose.connect(process.env.MONGO_URI!);
    
    // Find a trainer and a member
    const trainer = await User.findOne({ role: 'trainer' });
    const member = await User.findOne({ role: 'member' });
    
    if (trainer && member) {
        await MemberRequest.create({
            member_id: member._id,
            trainer_id: trainer._id,
            request_text: "Hi Trainer, what's the best time for our next session?",
            status: 'pending'
        });
        console.log("Mock request seeded!");
    } else {
        console.log("Trainer or Member not found. Please register them first.");
    }
    
    await mongoose.disconnect();
}

seed();
