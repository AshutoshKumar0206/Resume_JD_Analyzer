"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllApplicationEntries = exports.processAIScoring = exports.processApplication = void 0;
const resume_jd_model_1 = require("../models/resume_jd.model");
const cloudinary_1 = require("../config/cloudinary");
const user_model_1 = require("../models/user.model");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const processApplication = async (req, res) => {
    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required."
            });
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }
        if (!req.file) {
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
        const fileHash = crypto_1.default.createHash('md5').update(resumeFile).digest('hex');
        const existingEntry = await resume_jd_model_1.Resume_JD.findOne({
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
        const cloudinaryResult = await (0, cloudinary_1.uploadToCloudinary)(resumeFile);
        const newEntry = await resume_jd_model_1.Resume_JD.create({
            userId,
            jdText: jdText.trim(),
            fileHash,
            resumeUrl: cloudinaryResult.secure_url,
            resumePublicId: cloudinaryResult.public_id,
        });
        const processedApplication = await (0, exports.processAIScoring)(newEntry);
        return res.status(201).json({
            success: true,
            message: "Application processed and saved successfully",
        });
    }
    catch (err) {
        console.log("Error in analysis of resume and JD", err);
        return res.status(500).json({
            success: false,
            message: `${err?.message || "Internal Server Error"}`
        });
    }
};
exports.processApplication = processApplication;
const processAIScoring = async (application) => {
    try {
        if (!application) {
            return {
                success: false,
                message: "Resume or jd application not found."
            };
        }
        const aiProcessing = await axios_1.default.post("http://localhost:5000/ai/analyze", application);
        console.log('AI', aiProcessing);
        return {
            success: true,
            message: "Application processed by AI model"
        };
    }
    catch (err) {
        console.log(err);
        return {
            success: false,
            message: `${err.response.data.message}`
        };
    }
};
exports.processAIScoring = processAIScoring;
const getAllApplicationEntries = async (req, res) => {
    try {
        const entries = await resume_jd_model_1.Resume_JD.find({});
        if (!entries) {
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
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: `${err.response.data.message}`
        });
    }
};
exports.getAllApplicationEntries = getAllApplicationEntries;
