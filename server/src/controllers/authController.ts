import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });
};

// ✅ REGISTER
export const register = async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    try {
        if (role === "admin") {
            return res.status(403).json({ message: "Admin registration is not allowed" });
        }
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString())
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ LOGIN
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    try {
        const user = await User.findOne({ email: email.trim() });
        if (!user) {
            console.log("User not found:", email);
        } else {
            console.log("User found, comparing passwords...");
        }

        if (user && await bcrypt.compare(password, user.password)) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString())
            });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};