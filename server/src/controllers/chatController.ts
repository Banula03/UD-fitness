import { Request, Response } from "express";
import Message from "../models/Message";

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { userId1, userId2 } = req.params;
        const messages = await Message.find({
            $or: [
                { senderId: userId1, receiverId: userId2 },
                { senderId: userId2, receiverId: userId1 },
            ]
        }).sort({ createdAt: 1 });

        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching messages" });
    }
};
