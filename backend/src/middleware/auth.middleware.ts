import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include user data
// export interface AuthRequest extends Request {
//     user?: any; 
// }

declare global {
  namespace Express {
    interface Request {
      // Replace 'any' with your actual User interface/type if you have one
      user?: any; 
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Get token from cookies
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.is_logged_in) {
        token = req.cookies.is_logged_in;
    }
    console.log(token);

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized to access this route"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        console.log(decoded)
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token verification failed"
        });
    }
};