import { Request, Response } from "express";
import Session from "../models/Session";
import User from "../models/User";
import Feedback from "../models/Feedback";
import MemberRequest from "../models/MemberRequest";
import LeaveRequest from "../models/LeaveRequest";
import MealPlan from "../models/MealPlan";
import WorkoutPlan from "../models/WorkoutPlan";
import jwt from "jsonwebtoken";

// Middleware to extract trainer ID from token (simple version for now)
const getTrainerIdFromToken = (req: Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        return decoded.id;
    } catch {
        return null;
    }
};

// ✅ GET SESSIONS
export const getSessions = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const sessions = await Session.find({ trainer_id: trainerId })
            .populate('member_id', 'name email phone')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: sessions });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching sessions" });
    }
};

// ✅ CREATE SESSION
export const createSession = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const { member_id, session_date, session_time, duration, type } = req.body;

        const session = await Session.create({
            trainer_id: trainerId,
            member_id,
            session_date,
            session_time,
            duration,
            type
        });

        res.status(201).json({ success: true, data: session });
    } catch (error) {
        res.status(500).json({ message: "Server error creating session" });
    }
};

// ✅ GET MEMBERS COUNT
export const getMembersCount = async (req: Request, res: Response) => {
    try {
        const count = await User.countDocuments({ role: "member" });

        res.json({ success: true, data: { count } });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching member count" });
    }
};

// ✅ ADD FEEDBACK (TO MEMBER)
export const addFeedback = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const { member_id, content } = req.body;
        const feedback = await Feedback.create({
            trainer_id: trainerId,
            member_id,
            content
        });

        res.status(201).json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ message: "Server error adding feedback" });
    }
};

// ✅ GET MEMBER REQUESTS
export const getMemberRequests = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const requests = await MemberRequest.find({ trainer_id: trainerId })
            .populate('member_id', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching requests" });
    }
};

// ✅ ADD REPLY TO REQUEST
export const addReply = async (req: Request, res: Response) => {
    try {
        const { requestId, reply_text } = req.body;
        const request = await MemberRequest.findByIdAndUpdate(
            requestId,
            { reply_text, status: "replied" },
            { new: true }
        );
        res.json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ message: "Server error adding reply" });
    }
};

// ✅ ADD LEAVE REQUEST
export const addLeaveRequest = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const { startDate, endDate, reason } = req.body;
        const leave = await LeaveRequest.create({
            trainer_id: trainerId,
            startDate,
            endDate,
            reason
        });

        res.status(201).json({ success: true, data: leave });
    } catch (error) {
        res.status(500).json({ message: "Server error adding leave request" });
    }
};

// ✅ GET LEAVE REQUESTS
export const getLeaveRequests = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const leaves = await LeaveRequest.find({ trainer_id: trainerId }).sort({ createdAt: -1 });
        res.json({ success: true, data: leaves });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching leave requests" });
    }
};

// ✅ ADD MEAL PLAN
export const addMealPlan = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const { member_id, plan_details } = req.body;
        const mealPlan = await MealPlan.create({
            trainer_id: trainerId,
            member_id,
            plan_details
        });

        res.status(201).json({ success: true, data: mealPlan });
    } catch (error) {
        res.status(500).json({ message: "Server error adding meal plan" });
    }
};

// ✅ ADD WORKOUT PLAN
export const addWorkoutPlan = async (req: Request, res: Response) => {
    try {
        const trainerId = getTrainerIdFromToken(req);
        if (!trainerId) return res.status(401).json({ message: "Unauthorized" });

        const { member_id, plan_details } = req.body;
        const workoutPlan = await WorkoutPlan.create({
            trainer_id: trainerId,
            member_id,
            plan_details
        });

        res.status(201).json({ success: true, data: workoutPlan });
    } catch (error) {
        res.status(500).json({ message: "Server error adding workout plan" });
    }
};

// ✅ GET ALL MEMBERS (FOR PICKING)
export const getAllMembers = async (req: Request, res: Response) => {
    try {
        const members = await User.find({ role: "member" }, "name email _id");
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching members" });
    }
};
