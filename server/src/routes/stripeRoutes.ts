// Stripe Endpoint Routing Configuration
import express from "express";
import { createCheckoutSession } from "../controllers/stripeController";

const router = express.Router();

// The checkout session creates an order and returns a Stripe URL
router.post("/create-checkout-session", createCheckoutSession);

export default router;
