import { Request, Response } from "express";
import User from "../models/User";
import Order from "../models/Order";
import bcrypt from "bcryptjs";

// ✅ GET STATS
export const getStats = async (req: Request, res: Response) => {
    try {
        const total_members = await User.countDocuments({ role: "member" });
        const active_staff = await User.countDocuments({ role: { $in: ["staff", "trainer", "accountant"] } });

        // Calculate true revenue from successful orders (Include pending for local testing without webhooks)
        const completedOrders = await Order.find({ status: { $ne: "cancelled" } });
        const total_revenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        
        // Mocking growth for now
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
        const completedOrders = await Order.find({ status: { $ne: "cancelled" } });
        const total_revenue = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const transaction_count = completedOrders.length;

        // Simulated category totals based on real revenue until product catalog expansion
        res.json({
            success: true,
            data: {
                total_revenue,
                transaction_count,
                category_totals: {
                    "Memberships": total_revenue * 0.5,
                    "Personal Training": total_revenue * 0.3,
                    "Merchandise": total_revenue * 0.2
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
// ✅ GET STAFF BY ID
export const getStaffById = async (req: Request, res: Response) => {
    try {
        const staff = await User.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: "Staff member not found" });
        }
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching staff member" });
    }
};

// ✅ UPDATE STAFF
export const updateStaff = async (req: Request, res: Response) => {
    const { name, email, role, phone, specialization, status } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "Staff member not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        user.specialization = specialization || user.specialization;
        user.status = status || user.status;

        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: "Server error updating staff" });
    }
};

// ✅ DELETE STAFF/TRAINER/MEMBER
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error deleting user" });
    }
};

// ✅ CREATE MEMBER
export const createMember = async (req: Request, res: Response) => {
    const { name, email, password, phone } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const member = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "member",
            phone,
            status: "active"
        });

        res.status(201).json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ message: "Server error creating member" });
    }
};

// ✅ UPDATE MEMBER
export const updateMember = async (req: Request, res: Response) => {
    const { name, email, phone, status } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "member") {
            return res.status(404).json({ message: "Member not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.status = status || user.status;

        await user.save();
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ message: "Server error updating member" });
    }
};

// ✅ GET MEMBER BY ID
export const getMemberById = async (req: Request, res: Response) => {
    try {
        const member = await User.findById(req.params.id);
        if (!member || member.role !== "member") {
            return res.status(404).json({ message: "Member not found" });
        }
        res.json({ success: true, data: member });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching member" });
    }
};

// ✅ GET ANALYTICS
export const getAnalytics = async (req: Request, res: Response) => {
    try {
        // 1. Revenue Timeline (Last 30 Days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const revenueData = await Order.aggregate([
            { 
                $match: { 
                    status: { $ne: "cancelled" },
                    createdAt: { $gte: thirtyDaysAgo }
                } 
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$total_amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const formattedRevenue = revenueData.map(item => ({
            date: item._id,
            revenue: item.revenue
        }));

        // 2. Member Activity (Active vs Inactive)
        const memberActivity = await User.aggregate([
            { $match: { role: "member" } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const formattedActivity = memberActivity.map(item => ({
            name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
            value: item.count
        }));

        // 3. Top Selling Products
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product_id",
                    totalSold: { $sum: "$items.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    name: "$productDetails.name",
                    sold: "$totalSold"
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                revenueTimeline: formattedRevenue,
                memberActivity: formattedActivity,
                topProducts
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching analytics" });
    }
};

// ✅ CHANGE PASSWORD
export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error changing password" });
    }
};
