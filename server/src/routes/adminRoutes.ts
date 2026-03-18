import express from "express";
import { getStats, getStaff, createStaff, getTrainers, getRevenue, getMembers } from "../controllers/adminController";

const router = express.Router();

// Stats
router.get("/stats", getStats);

// Staff management
router.get("/staff", getStaff);
router.post("/staff", createStaff);

// Trainer management
router.get("/trainers", getTrainers);
router.post("/trainers", createStaff); // Reusing createStaff as the logic is similar for now

// Revenue tracking
router.get("/revenue", getRevenue);

// Member management
router.get("/members", getMembers);

export default router;
