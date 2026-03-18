const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MemberRequestSchema = new mongoose.Schema({
    member_id: String,
    trainer_id: mongoose.Schema.Types.ObjectId,
    request_text: String,
    reply_text: { type: String, default: "" },
    status: { type: String, default: "pending" }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    name: String,
    role: String
});

const MemberRequest = mongoose.model('MemberRequest', MemberRequestSchema);
const User = mongoose.model('User', UserSchema);

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    
    const trainer = await User.findOne({ role: 'trainer' });
    const member = await User.findOne({ role: 'member' });
    
    if (trainer && member) {
        await MemberRequest.create({
            member_id: member._id.toString(),
            trainer_id: trainer._id,
            request_text: "Hi Trainer, can you review my meal plan?",
            status: 'pending'
        });
        console.log("Mock request seeded!");
    } else {
        console.log("Trainer or Member not found. Trainer:", !!trainer, "Member:", !!member);
    }
    
    await mongoose.disconnect();
}

seed();
