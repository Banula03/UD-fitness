import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

// ✅ GET STATS
export const getStats = async (req: Request, res: Response) => {
    try {
        const total_members = await User.countDocuments({ role: "member" });
        const active_staff = await User.countDocuments({ role: { $in: ["staff", "trainer", "accountant"] } });
        
        // Mocking revenue and growth for now
        const total_revenue = 12500.50;
        const monthly_growth = 12.5;

        res.json({
            success: true,
            data: {
                total_members,
                total_revenue,
                active_staff,
                monthly_growth
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

// ✅ GET STAFF
export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await User.find({ role: { $in: ["staff", "trainer", "accountant"] } });
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching staff" });
    }
};

// ✅ CREATE STAFF
export const createStaff = async (req: Request, res: Response) => {
    const { name, email, password, role, phone, specialization } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            specialization,
            status: "active"
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: "Server error creating staff" });
    }
};

// ✅ GET TRAINERS
export const getTrainers = async (req: Request, res: Response) => {
    try {
        const trainers = await User.find({ role: "trainer" });
        res.json({ success: true, data: trainers });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching trainers" });
    }
};

// ✅ GET REVENUE
export const getRevenue = async (req: Request, res: Response) => {
    try {
        // Mocked revenue data as requested by the dashboard structure
        res.json({
            success: true,
            data: {
                total_revenue: 12500.50,
                transaction_count: 45,
                category_totals: {
                    "Memberships": 8000.00,
                    "Personal Training": 3500.00,
                    "Merchandise": 1000.50
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching revenue" });
    }
};

// ✅ GET MEMBERS
export const getMembers = async (req: Request, res: Response) => {
    try {
        const members = await User.find({ role: "member" });
        res.json({ success: true, data: members });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching members" });
    }
};
