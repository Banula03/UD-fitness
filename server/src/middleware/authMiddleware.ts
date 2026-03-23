import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            (req as any).user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    // This assumes the token payload includes role, if not we might need to fetch user from DB
    // For now, let's just use 'protect' and check role in controller if needed, 
    // or decode it here if we put it in the token.
    // Looking at authController.ts, we only put 'id' in the token.
    next(); 
};
