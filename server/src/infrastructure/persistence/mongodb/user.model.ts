import mongoose, { Schema, type Document } from "mongoose";
import type { UserRole } from "../../../domain/entities/user.entity.js";
import { string } from "zod";

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["recruiter", "admin"], default: "recruiter" },
  },
  { timestamps: true },
);
export const UserModel = mongoose.model<UserDocument>("User", userSchema);
