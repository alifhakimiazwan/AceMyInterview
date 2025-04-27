import mongoose from "mongoose";
import { Schema } from "mongoose";

const InterviewSchema: Schema = new Schema(
  {
    role: { type: String, required: true },
    type: { type: String, required: true },
    techstack: { type: [String], required: true, default: [] },
    amount: { type: String, required: true },
    questions: { type: [String], required: true, default: [] },
    userId: { type: String, required: true },
    finalized: { type: Boolean, default: true },
    coverImage: { type: String, required: true },
  },
  { timestamps: true }
);
export const Interview =
  mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
