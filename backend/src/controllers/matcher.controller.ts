import { Request, Response } from "express";
import { IResumeJD, Resume_JD } from "../models/resume_jd.model";
import { uploadToCloudinary } from "../config/cloudinary";
import { User } from "../models/user.model";
import crypto from "crypto";
import axios from "axios";

export const processApplication = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = req?.user?.id;
        if(!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "User ID is required." 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found." 
            });
        }
        
        if(!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: "No resume file uploaded." 
            });
        }
        const resumeFile = req.file.buffer;

        const { jdText } = req.body;


        if (!jdText) {
            return res.status(400).json({ 
                success: false, 
                message: "No JD pasted to analyze." 
            });
        }

        const fileHash = crypto.createHash('md5').update(resumeFile).digest('hex');

        const existingEntry = await Resume_JD.findOne({
            userId,
            fileHash, 
            jdText: jdText.trim(),
        });

        if (existingEntry) {
            return res.status(409).json({ 
                success: false, 
                message: "This resume has already been submitted for the job description.",
            });
        }

        const cloudinaryResult = await uploadToCloudinary(resumeFile);

        const newEntry = await Resume_JD.create({
            userId,
            jdText: jdText.trim(),
            fileHash,
            resumeUrl: cloudinaryResult.secure_url,
            resumePublicId: cloudinaryResult.public_id,
        });

        const processedApplication = await processAIScoring(newEntry);

        return res.status(201).json({
            success: true,
            message: "Application processed and saved successfully",
        }); 
    } catch(err: any) {
        console.log("Error in analysis of resume and JD", err);
        return res.status(500).json({ 
            success: false, 
            message: `${err?.message || "Internal Server Error"}` 
        });
    }
}

export const processAIScoring = async (application: IResumeJD): Promise<any> => {
    try {
        if(!application) {
            return {
                success: false, 
                message: "Resume or jd application not found."
            }
        }
        
        const aiProcessing = await axios.post("http://localhost:5000/ai/analyze", application);
        console.log('AI', aiProcessing);
        return {
            success: true,
            message: "Application processed by AI model"
        }; 
    } catch(err: any) {
        console.log(err);
        return{ 
            success: false, 
            message: `${err.response.data.message}` 
        };
    }
}

export const getAllApplicationEntries = async (req: Request, res: Response): Promise<any> => {
    try {
        const entries = await Resume_JD.find({});
        if(!entries) {
            return res.status(404).json({ 
                success: false, 
                message: "No application entries found." 
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Application entries retrieved successfully",
            data: entries
        }); 
    } catch(err: any) {
        console.log(err);
        return res.status(500).json({ 
            success: false, 
            message: `${err.response.data.message}` });
    }
}