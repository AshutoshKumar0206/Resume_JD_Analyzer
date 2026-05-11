"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resume_JD = void 0;
const mongoose_1 = require("mongoose");
// 2. Create the Schema
const resumeJDSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    jdText: {
        type: String,
        required: true,
        trim: true,
    },
    resumeUrl: {
        type: String,
        required: true,
    },
    resumePublicId: {
        type: String,
        required: true,
    },
    fileHash: {
        type: String,
        required: true,
        index: true, // Speeds up the duplicate check query
    },
    analysisResult: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
exports.Resume_JD = (0, mongoose_1.model)('Resume_JD', resumeJDSchema);
