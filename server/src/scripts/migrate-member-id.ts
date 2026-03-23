/**
 * Migration Script: Convert member_id from String to ObjectId
 *
 * Run in dry-run mode (no changes):
 *   DRY_RUN=true npx ts-node src/scripts/migrate-member-id.ts
 *
 * Run for real:
 *   npx ts-node src/scripts/migrate-member-id.ts
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DRY_RUN = process.env.DRY_RUN === "true";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gym-management";

const COLLECTIONS = ["sessions", "workoutplans", "mealplans", "feedbacks", "memberrequests"];

async function migrateCollection(db: mongoose.mongo.Db, collectionName: string) {
    const collection = db.collection(collectionName);
    const docs = await collection.find({ member_id: { $type: "string" } }).toArray();

    if (docs.length === 0) {
        console.log(`[${collectionName}] ✅ No string member_ids found — already migrated or empty.`);
        return;
    }

    console.log(`[${collectionName}] Found ${docs.length} document(s) with string member_id.`);

    for (const doc of docs) {
        const originalId = doc.member_id;

        // Validate that the string is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(originalId)) {
            console.warn(`[${collectionName}] ⚠️  Skipping doc ${doc._id} — member_id "${originalId}" is not a valid ObjectId.`);
            continue;
        }

        const newObjectId = new mongoose.Types.ObjectId(originalId);
        console.log(`[${collectionName}] ${DRY_RUN ? "[DRY RUN] Would convert" : "Converting"} doc ${doc._id}: "${originalId}" → ObjectId`);

        if (!DRY_RUN) {
            await collection.updateOne(
                { _id: doc._id },
                { $set: { member_id: newObjectId } }
            );
        }
    }

    console.log(`[${collectionName}] ${DRY_RUN ? "Dry run complete." : "✅ Migration complete."}`);
}

async function main() {
    console.log(`\n🚀 Starting migration${DRY_RUN ? " (DRY RUN — no changes will be made)" : ""}...\n`);

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db!;

    for (const col of COLLECTIONS) {
        await migrateCollection(db, col);
        console.log();
    }

    await mongoose.disconnect();
    console.log("✅ Done. Disconnected from MongoDB.");
}

main().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
