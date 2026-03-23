import express from "express";
import { 
    createPlan, 
    getAllPlans, 
    updatePlan, 
    assignPlanToUser, 
    getActiveMembership, 
    getMembershipHistory 
} from "../controllers/membershipController";

const router = express.Router();

// Plan management (Admin)
router.post("/plans", createPlan);
router.get("/plans", getAllPlans);
router.put("/plans/:id", updatePlan);

// Subscription management
router.post("/subscribe", assignPlanToUser);
router.get("/user/:userId/active", getActiveMembership);
router.get("/user/:userId/history", getMembershipHistory);

export default router;
