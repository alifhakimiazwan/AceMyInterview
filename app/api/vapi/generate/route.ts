import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { connectDB } from "@/lib/mongodb";
import { Interview } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  return Response.json({ message: "Hello from the server!" }, { status: 200 });
}

export async function POST(request: Request) {
  const { type, role, level, techstack, amount } = await request.json();
  const { userId } = await auth();

  try {
    await connectDB(); // Make sure database is connected

    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        
        Thank you! <3
    `,
    });

    const interview = await Interview.create({
      userId,
      role,
      type,
      techstack: techstack.split(","), // clean spaces
      amount,
      questions: JSON.parse(questions), // <- very important! because AI returns as string
      finalized: true,
      coverImage: getRandomInterviewCover(),
    });
    return Response.json({ success: true, interview }, { status: 201 });
  } catch (error) {
    console.error("Error in POST request:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}
