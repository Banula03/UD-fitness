import { Request, Response } from "express";
import Order from "../models/Order";

// ✅ CREATE ORDER
export const createOrder = async (req: Request, res: Response) => {
    const { member_id, items, shipping_address, phone, payment_method } = req.body;

    try {
        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const total_amount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        const order = await Order.create({
            member_id,
            items,
            shipping_address,
            phone,
            payment_method,
            total_amount,
            status: payment_method === "COD" ? "processing" : "pending"
        });

        res.status(201).json({
            success: true,
            order_id: order._id,
            message: "Order placed successfully"
        });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ success: false, message: "Server error placing order" });
    }
};

// ✅ GET MEMBER ORDERS
export const getMemberOrders = async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({ member_id: req.params.memberId }).sort({ createdAt: -1 });
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error fetching orders" });
    }
};
