import { Schema, model, Document, Types } from 'mongoose';

export interface IResumeJD extends Document {
    userId: Types.ObjectId;     // Reference to the User
    jdText: string;             // The Job Description text
    resumeUrl: string;          // Cloudinary PDF URL
    fileHash: string;
    resumePublicId: string;     // Cloudinary ID (for deletion)
    analysisResult?: any;       // Optional: storage for AI/Analysis output
    createdAt: Date;
}

// 2. Create the Schema
const resumeJDSchema = new Schema<IResumeJD>
({
    userId: {
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.Mixed,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

export const Resume_JD = model<IResumeJD>(
    'Resume_JD', 
    resumeJDSchema
);