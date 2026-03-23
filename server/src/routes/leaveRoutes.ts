import express from "express";
import { createLeaveRequest, getTrainerLeaveRequests, getAllLeaveRequests, updateLeaveStatus } from "../controllers/leaveController";

const router = express.Router();

router.post("/", createLeaveRequest);
router.get("/trainer/:trainerId", getTrainerLeaveRequests);
router.get("/", getAllLeaveRequests);
router.put("/:id/status", updateLeaveStatus);

export default router;
