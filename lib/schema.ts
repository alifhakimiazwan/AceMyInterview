import mongoose from "mongoose";
import { Schema } from "mongoose";

const InterviewSchema: Schema = new Schema(
  {
    role: { type: String },
    type: { type: String },
    techstack: { type: [String], default: [] },
    amount: { type: Number }, // ✅ Corrected to Number
    questions: { type: [String], default: [] },
    userId: { type: String },
    finalized: { type: Boolean, default: true },
    coverImage: { type: String },
  },
  { timestamps: true } // ✅ createdAt and updatedAt will be handled automatically
);

export const Interview =
  mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
