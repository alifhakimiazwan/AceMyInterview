import { feedbackSchema } from "@/constants";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/lib/schema";
import { CreateFeedbackParams } from "@/types";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { Feedback } from "@/lib/schema";

export async function getInterviewsByUserId(userId: string) {
  try {
    await connectDB();

    const interviews = await Interview.find({ userId }).sort({ createdAt: -1 }); // newest first

    return interviews;
  } catch (error) {
    console.error("Error fetching interviews by userId:", error);
    return [];
  }
}

export async function getLatestInterviews(userId: string) {
  try {
    await connectDB();

    const interviews = await Interview.find({
      userId: { $ne: userId }, // 🔥 Find interviews NOT by current user
    })
      .sort({ createdAt: -1 }) // newest first
      .limit(20); // limit to 20 interviews

    return interviews;
  } catch (error) {
    console.error("Error fetching latest interviews:", error);
    return [];
  }
}

export async function getInterviewById(interviewId: string) {
  try {
    await connectDB();

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return null; // Interview not found
    }

    return interview;
  } catch (error) {
    console.error("Error fetching interview by ID:", error);
    return null; // Always safe to return null if error
  }
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    await connectDB();
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          Transcript:
          ${formattedTranscript}
  
          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses.
          - **Technical Knowledge**: Understanding of key concepts for the role.
          - **Problem-Solving**: Ability to analyze problems and propose solutions.
          - **Cultural & Role Fit**: Alignment with company values and job role.
          - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
          `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedbackData = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    if (feedbackId) {
      // Update existing feedback
      await Feedback.findByIdAndUpdate(feedbackId, feedbackData, { new: true });
    } else {
      // Create new feedback
      await Feedback.create(feedbackData);
    }

    return { success: true, feedbackId: feedbackId || null };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { success: false, error: "Error creating feedback" };
  }
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
) {
  const { interviewId, userId } = params;

  try {
    await connectDB();

    const feedback = await Feedback.findOne({
      interviewId: interviewId,
      userId: userId,
    });

    if (!feedback) return null;

    return feedback;
  } catch (error) {
    console.error("Error fetching feedback by interviewId:", error);
    return null;
  }
}
