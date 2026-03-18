import mongoose from "mongoose";
import MemberRequest from "./models/MemberRequest";
import User from "./models/User";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

async function verify() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");

    // 1. Find or Create two trainers
    let trainer1 = await User.findOne({ email: "alpha@test.com" });
    if (!trainer1) {
      trainer1 = await User.create({
        name: "Trainer Alpha",
        email: "alpha@test.com",
        password: "password123",
        role: "trainer",
      });
    }
    let trainer2 = await User.findOne({ email: "beta@test.com" });
    if (!trainer2) {
      trainer2 = await User.create({
        name: "Trainer Beta",
        email: "beta@test.com",
        password: "password123",
        role: "trainer",
      });
    }

    const memberId = "test_member_id_123";

    // 2. Clear previous test requests
    await MemberRequest.deleteMany({ member_id: memberId });

    // 3. Create request for Trainer Alpha
    await MemberRequest.create({
      member_id: memberId,
      trainer_id: trainer1._id as mongoose.Types.ObjectId,
      request_text: "Help me Alpha!",
      status: "pending",
    });

    // 4. Verify Trainer Alpha sees it
    const alphaRequests = await MemberRequest.find({
      trainer_id: trainer1._id,
      member_id: memberId,
    });
    console.log(`Trainer Alpha requests: ${alphaRequests.length} (Expected: 1)`);
    console.log(`Content: ${alphaRequests[0].request_text}`);

    // 5. Verify Trainer Beta DOES NOT see it
    const betaRequests = await MemberRequest.find({
      trainer_id: trainer2._id,
      member_id: memberId,
    });
    console.log(`Trainer Beta requests: ${betaRequests.length} (Expected: 0)`);

    if (alphaRequests.length === 1 && betaRequests.length === 0) {
      console.log("BACKEND ROUTING VERIFIED SUCCESSFULLY");
    } else {
      console.log("BACKEND ROUTING VERIFICATION FAILED");
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

verify();
