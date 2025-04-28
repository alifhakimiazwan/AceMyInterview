import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/lib/schema";

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
