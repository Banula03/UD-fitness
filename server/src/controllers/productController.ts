import { Request, Response } from "express";
import Product from "../models/Product";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching products" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ message: "Server error fetching product" });
    }
};
