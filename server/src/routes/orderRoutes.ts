import express from "express";
import { createOrder, getMemberOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/member/:memberId", getMemberOrders);
router.patch("/:orderId/status", updateOrderStatus);

export default router;
