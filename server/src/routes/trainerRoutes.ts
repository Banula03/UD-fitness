import express from "express";
import { 
    getSessions, 
    createSession, 
    getMembersCount, 
    addFeedback, 
    getMemberRequests, 
    addReply, 
    addLeaveRequest, 
    getLeaveRequests, 
    addMealPlan, 
    addWorkoutPlan, 
    getAllMembers 
} from "../controllers/trainerController";

const router = express.Router();

router.get("/sessions", getSessions);
router.post("/sessions", createSession);
router.get("/members-count", getMembersCount);
router.get("/members", getAllMembers);

router.post("/feedback", addFeedback);

router.get("/requests", getMemberRequests);
router.post("/requests/reply", addReply);

router.get("/leave", getLeaveRequests);
router.post("/leave", addLeaveRequest);

router.post("/meal-plan", addMealPlan);
router.post("/workout-plan", addWorkoutPlan);

export default router;
