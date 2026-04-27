import { Request, Response } from "express"
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if(!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                sucess: false,
                message: "Name, email, password and confirm password are required"
            })
        }

        if (password.length < 12) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 12 characters long",
            });
        }

        if(password !== confirmPassword) {
            return res.status(400).json({
                sucess: false,
                message: "Password and confirm password do not match"
            })
        }

        const existingUser = await User.findOne({ email: email });
        if(existingUser) {
            return res.status(400).json({
                sucess: false,
                message: "User already exists"
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name: name, email: email, password: hashedPassword });

        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET || "",
            { expiresIn: "1d" }
        );

        // 7. Set the Cookie
        res.cookie("user_token", token, {
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: "lax", // Protects against CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        res.cookie("is_logged_in", token, {
            httpOnly: false, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: "lax", // Protects against CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        return res.status(201).json({ 
            success: true,
            message: "User created successfully",
            user: { id: newUser._id, email: newUser.email }
        })
    } catch(err: any) {
        return res.status(500).json({ 
            sucess: false,
            message: err.message 
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ 
                sucess: false,
                message: "Email and password are required" 
            })
        }

        const user = await User.findOne({ email: email }).select("+password");
        if(!user) {
            return res.status(404).json({ 
                sucess: false,
                message: "User not found" 
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ 
                sucess: false,
                message: "Invalid credentials" 
            })
        }
        
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET || "",
            { expiresIn: "1d" }
        );

        // 4. Set HTTP-Only Cookie
        res.cookie("user_token", token, {
            httpOnly: true, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: "lax", // Protects against CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });

        res.cookie("is_logged_in", token, {
            httpOnly: false, // Prevents XSS attacks
            secure: process.env.NODE_ENV === "production", // Only HTTPS in production
            sameSite: "lax", // Protects against CSRF
            maxAge: 1 * 24 * 60 * 60 * 1000, // 7 days
            path: "/",
        });


      return res.status(200).json({ 
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            username: user.name,
            email: user.email,
        },
      })
    } catch(err: any) {
        console.error("Login Error:", err);
        return res.status(500).json({ 
            sucess: false,
            message: err.message 
        })
    }
}