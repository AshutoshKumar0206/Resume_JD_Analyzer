import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Define an Interface for the User Document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// 2. Create the Schema
const userSchema = new Schema<IUser>
({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: /^\S+@\S+\.\S+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const User = model<IUser>(
    'User', 
    userSchema
);