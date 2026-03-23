import { Request, Response } from "express";
import LeaveRequest from "../models/LeaveRequest";

// ✅ CREATE LEAVE REQUEST (TRAINER)
export const createLeaveRequest = async (req: Request, res: Response) => {
    try {
        const { trainer_id, startDate, endDate, reason } = req.body;
        
        if (!trainer_id || !startDate || !endDate || !reason) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const leaveRequest = await LeaveRequest.create({
            trainer_id,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json({ success: true, data: leaveRequest });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ GET TRAINER'S LEAVE REQUESTS (TRAINER)
export const getTrainerLeaveRequests = async (req: Request, res: Response) => {
    try {
        const requests = await LeaveRequest.find({ trainer_id: req.params.trainerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ GET ALL LEAVE REQUESTS (ADMIN)
export const getAllLeaveRequests = async (req: Request, res: Response) => {
    try {
        const requests = await LeaveRequest.find().populate("trainer_id", "name email").sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ UPDATE LEAVE STATUS (ADMIN)
export const updateLeaveStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.body;
        if (!["approved", "declined"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const request = await LeaveRequest.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ success: false, message: "Leave request not found" });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
