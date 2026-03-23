import { Request, Response } from "express";
import MembershipPlan from "../models/MembershipPlan";
import UserMembership from "../models/UserMembership";
import User from "../models/User";
import mongoose from "mongoose";

// --- ADMIN ACTIONS ---

// ✅ Create a new Membership Plan
export const createPlan = async (req: Request, res: Response) => {
    try {
        const plan = await MembershipPlan.create(req.body);
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ message: "Error creating plan" });
    }
};

// ✅ Get all Membership Plans
export const getAllPlans = async (req: Request, res: Response) => {
    try {
        const plans = await MembershipPlan.find({ isActive: true });
        res.json({ success: true, data: plans });
    } catch (error) {
        res.status(500).json({ message: "Error fetching plans" });
    }
};

// ✅ Update a Membership Plan
export const updatePlan = async (req: Request, res: Response) => {
    try {
        const plan = await MembershipPlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ message: "Error updating plan" });
    }
};

// ✅ Assign a Plan to a User
export const assignPlanToUser = async (req: Request, res: Response) => {
    try {
        const { userId, planId } = req.body;
        
        const plan = await MembershipPlan.findById(planId);
        if (!plan) return res.status(404).json({ message: "Plan not found" });

        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + plan.durationInMonths);

        const userMembership = await UserMembership.create({
            user_id: userId,
            plan_id: planId,
            endDate,
            amountPaid: plan.price,
            status: "active",
            paymentStatus: "paid"
        });

        // Update User model
        await User.findByIdAndUpdate(userId, {
            currentMembership: userMembership._id,
            $push: { membershipHistory: userMembership._id }
        });

        res.status(201).json({ success: true, data: userMembership });
    } catch (error) {
        res.status(500).json({ message: "Error assigning plan" });
    }
};

// --- MEMBER ACTIONS ---

// ✅ Get Member's Active Membership
export const getActiveMembership = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const membership = await UserMembership.findOne({ user_id: userId, status: "active" })
            .populate("plan_id");
        
        res.json({ success: true, data: membership });
    } catch (error) {
        res.status(500).json({ message: "Error fetching membership" });
    }
};

// ✅ Get Member's Membership History
export const getMembershipHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const history = await UserMembership.find({ user_id: userId })
            .populate("plan_id")
            .sort({ createdAt: -1 });
            
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ message: "Error fetching history" });
    }
};
