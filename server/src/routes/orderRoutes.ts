import express from "express";
import { createOrder, getMemberOrders } from "../controllers/orderController";

const router = express.Router();

router.post("/", createOrder);
router.get("/member/:memberId", getMemberOrders);

export default router;
