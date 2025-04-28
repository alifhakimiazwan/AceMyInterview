import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/lib/schema";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { feedbackSchema } from "@/constants";

export async function POST(req: NextRequest) {
  try {
    const { interviewId, userId, transcript, feedbackId } = await req.json();

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

    let feedbackRef = null;

    if (feedbackId) {
      feedbackRef = await Feedback.findByIdAndUpdate(feedbackId, feedbackData, {
        new: true,
      });
    } else {
      feedbackRef = await Feedback.create(feedbackData);
    }

    await feedbackRef.set(feedbackData);

    return NextResponse.json({ success: true, feedbackId: feedbackRef.id }); // ✅ Very important await Feedback.create(feedbackData);
  } catch (error) {
    console.error("Error in feedback API:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
