import mongoose, { Schema } from "mongoose";

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

const FeedbackSchema = new Schema({
  interviewId: { type: String, required: true },
  userId: { type: String, required: true },
  totalScore: { type: Number, required: true },
  categoryScores: { type: Object, required: true }, // or Map, depending
  strengths: { type: [String], required: true }, // array of strings
  areasForImprovement: { type: [String], required: true },
  finalAssessment: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const Feedback =
  mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
