import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            
            // Attach user id and role to request
            (req as any).user = {
                id: decoded.id,
                role: decoded.role
            };
            
            next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ 
                message: `Role (${user?.role || 'unknown'}) is not authorized to access this route` 
            });
        }
        
        next();
    };
};
