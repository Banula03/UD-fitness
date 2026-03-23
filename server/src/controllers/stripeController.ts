import { Request, Response } from "express";
import Stripe from "stripe";
import Order from "../models/Order";
import dotenv from "dotenv";

dotenv.config();

// Ensure stripe is initialized only if the key exists to avoid crashing if user hasn't added it yet
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "dummy_key";
const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20" as any, // Use the latest compatible API version
});

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ success: false, message: "Server configuration missing: STRIPE_SECRET_KEY is not set." });
        }

        const { member_id, items, shipping_address, phone, payment_method } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "No items in order" });
        }

        const total_amount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

        // 1. Create a "pending" order in MongoDB
        const order = await Order.create({
            member_id,
            items,
            shipping_address,
            phone,
            payment_method: payment_method || "CARD", // Enforce CARD for Stripe
            total_amount,
            status: "pending"
        });

        // 2. Format items for Stripe Checkout
        const lineItems = items.map((item: any) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name || "Gym Store Product",
                    },
                    unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
                },
                quantity: item.quantity,
            };
        });

        const origin = req.headers.origin || "http://localhost:3000";

        // 3. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            client_reference_id: order._id.toString(),
            success_url: `${origin}/checkout-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `${origin}/checkout-cancel`,
            metadata: {
                orderId: order._id.toString(),
            }
        });

        res.status(200).json({
            success: true,
            url: session.url
        });

    } catch (error: any) {
        console.error("Error creating Stripe checkout session:", error);
        res.status(500).json({ success: false, message: error.message || "Server error setting up payment." });
    }
};

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!endpointSecret) {
            console.warn("STRIPE_WEBHOOK_SECRET is not configured. Trusting the raw event payload (Not Recommended for Production).");
            event = JSON.parse((req.body as Buffer).toString('utf8'));
        } else {
            // Reconstruct the raw body from req.body depending on how Express passed it
            // We configured it with express.raw() in the route, so req.body should be a Buffer
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.metadata?.orderId || session.client_reference_id;

        if (orderId) {
            try {
                // Update the order status to processing
                await Order.findByIdAndUpdate(orderId, { status: "processing" });
                console.log(`Payment successful for Order ID: ${orderId}. Status updated.`);
            } catch (err) {
                console.error(`Failed to update order ${orderId} upon successful payment:`, err);
            }
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
};
