import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include user data
export interface AuthRequest extends Request {
    user?: any; 
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Get token from cookies
    if (req.cookies && req.cookies.user_token) {
        token = req.cookies.user_token;
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }
};