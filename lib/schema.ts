import mongoose from "mongoose";
import { Schema } from "mongoose";

const InterviewSchema: Schema = new Schema(
  {
    role: { type: String },
    type: { type: String },
    techstack: { type: [String], default: [] },
    amount: { type: Number }, // ✅ Corrected to Number
    questions: { type: [String], default: [], required: true },
    userId: { type: String, required: true },
    finalized: { type: Boolean, default: true },
    coverImage: { type: String },
  },
  { timestamps: true } // ✅ createdAt and updatedAt will be handled automatically
);

export const Interview =
  mongoose.models.Interview || mongoose.model("Interview", InterviewSchema);
