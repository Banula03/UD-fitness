import { Request, Response } from "express";
import Session from "../models/Session";
import MealPlan from "../models/MealPlan";
import WorkoutPlan from "../models/WorkoutPlan";
import Feedback from "../models/Feedback";
import MemberRequest from "../models/MemberRequest";
import User from "../models/User";
import jwt from "jsonwebtoken";

const getMemberIdFromToken = (req: Request) => {
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

export const getMemberDashboardData = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const sessions = await Session.find({ member_id: memberId }).sort({ session_date: -1 });
        const mealPlansCount = await MealPlan.countDocuments({ member_id: memberId });
        const workoutPlansCount = await WorkoutPlan.countDocuments({ member_id: memberId });
        const pendingRequestsCount = await MemberRequest.countDocuments({ member_id: memberId, status: "pending" });

        res.json({
            success: true,
            data: {
                sessions,
                stats: {
                    mealPlansCount,
                    workoutPlansCount,
                    pendingRequestsCount
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching dashboard data" });
    }
};

export const getWorkoutPlans = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const plans = await WorkoutPlan.find({ member_id: memberId }).sort({ createdAt: -1 });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching workout plans" });
    }
};

export const getMealPlans = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const plans = await MealPlan.find({ member_id: memberId }).sort({ createdAt: -1 });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching meal plans" });
    }
};

export const getFeedback = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const feedback = await Feedback.find({ member_id: memberId }).sort({ createdAt: -1 });
        res.json({ success: true, data: feedback });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching feedback" });
    }
};

export const getMemberRequests = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const requests = await MemberRequest.find({ member_id: memberId }).sort({ createdAt: -1 });
        res.json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching requests" });
    }
};

export const submitMemberRequest = async (req: Request, res: Response) => {
    try {
        const memberId = getMemberIdFromToken(req);
        if (!memberId) return res.status(401).json({ message: "Unauthorized" });

        const { request_text, trainer_id } = req.body;
        // In this system, we now assign to a specific trainer if provided.
        const request = await MemberRequest.create({
            member_id: memberId,
            trainer_id,
            request_text,
            status: "pending"
        });

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ message: "Server error submitting request" });
    }
};

export const getAllTrainers = async (req: Request, res: Response) => {
    try {
        const trainers = await User.find({ role: "trainer" }, "name _id");
        res.json({ success: true, data: trainers });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching trainers" });
    }
};
