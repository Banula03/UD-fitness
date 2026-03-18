import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import trainerRoutes from "./routes/trainerRoutes";
import memberRoutes from "./routes/memberRoutes";
import productRoutes from "./routes/productRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/trainer", trainerRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/products", productRoutes);

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

app.listen(5000, () => {
    console.log("Server running on port 5000");
});