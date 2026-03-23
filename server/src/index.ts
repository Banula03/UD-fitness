import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import trainerRoutes from "./routes/trainerRoutes";
import memberRoutes from "./routes/memberRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import chatRoutes from "./routes/chatRoutes";
import stripeRoutes from "./routes/stripeRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import { stripeWebhook } from "./controllers/stripeController";
import Message from "./models/Message";

dotenv.config();

const app = express();
app.use(cors());

// Stripe Webhook MUST explicitly bypass express.json()
app.post("/api/stripe/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json());

app.use("/api/stripe", stripeRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/leave", leaveRoutes);

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    socket.on("join_room", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    
    socket.on("send_message", async (data) => {
        try {
            // data contains: senderId, receiverId, content, room
            const newMessage = await Message.create({
                senderId: data.senderId,
                receiverId: data.receiverId,
                content: data.content
            });
            // Send back the created message to everyone in the room
            io.to(data.room).emit("receive_message", newMessage);
            // NEW: Emit to personal notification room
            io.to(data.receiverId).emit("new_message_notification", newMessage);
        } catch (error) {
            console.error("Error saving message", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

httpServer.listen(5000, () => {
    console.log("Server running on port 5000");
});