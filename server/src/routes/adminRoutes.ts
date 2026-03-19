import express from "express";
import {
    getStats,
    getStaff,
    createStaff,
    updateStaff,
    deleteUser,
    getStaffById,
    getTrainers,
    getRevenue,
    getMembers,
    createMember,
    updateMember,
    getMemberById
} from "../controllers/adminController";

const router = express.Router();

// Stats
router.get("/stats", getStats);

// Staff management
router.get("/staff", getStaff);
router.post("/staff", createStaff);
router.get("/staff/:id", getStaffById);
router.put("/staff/:id", updateStaff);
router.delete("/staff/:id", deleteUser);

// Trainer management
router.get("/trainers", getTrainers);
router.post("/trainers", createStaff);
router.get("/trainers/:id", getStaffById);
router.put("/trainers/:id", updateStaff);
router.delete("/trainers/:id", deleteUser);

// Revenue tracking
router.get("/revenue", getRevenue);

// Member management
router.get("/members", getMembers);
router.post("/members", createMember);
router.get("/members/:id", getMemberById);
router.put("/members/:id", updateMember);
router.delete("/members/:id", deleteUser);

export default router;
