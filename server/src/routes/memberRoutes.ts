import express from "express";
import { 
    getMemberDashboardData, 
    getWorkoutPlans, 
    getMealPlans, 
    getFeedback, 
    getMemberRequests, 
    submitMemberRequest,
    getAllTrainers
} from "../controllers/memberController";

import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);
router.use(authorize(["member"]));

router.get("/dashboard", getMemberDashboardData);
router.get("/workout-plans", getWorkoutPlans);
router.get("/meal-plans", getMealPlans);
router.get("/feedback", getFeedback);
router.get("/requests", getMemberRequests);
router.post("/requests", submitMemberRequest);
router.get("/trainers", getAllTrainers);

export default router;
