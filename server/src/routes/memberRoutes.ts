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

const router = express.Router();

router.get("/dashboard", getMemberDashboardData);
router.get("/workout-plans", getWorkoutPlans);
router.get("/meal-plans", getMealPlans);
router.get("/feedback", getFeedback);
router.get("/requests", getMemberRequests);
router.post("/requests", submitMemberRequest);
router.get("/trainers", getAllTrainers);

export default router;
