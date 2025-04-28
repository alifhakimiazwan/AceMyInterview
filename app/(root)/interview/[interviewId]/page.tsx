import { auth } from "@clerk/nextjs/server";
import React from "react";
import { getInterviewById } from "@/lib/actionDb";
import { redirect } from "next/navigation";
import Agent from "@/components/Agent";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { RouteParams } from "@/types";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { clerkClient } from "@clerk/nextjs/server";

const InterviewDetails = async ({ params }: RouteParams) => {
  const { interviewId } = await params;

  const { userId } = await auth();
  const client = await clerkClient();

  const user = await client.users.getUser(userId!);

  const interview = await getInterviewById(interviewId);

  if (!interview) redirect("/");

  return (
    <>
      <div className="flex flex-row gap-4 justify-between">
        <div className="flex flex-row gap-4 items-center max-sm:flex-col">
          <div className="flex flex-row gap-4 items-center">
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        <p className="bg-dark-200 px-4 py-2 rounded-lg h-fit">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user.fullName || "You"}
        userId={user?.id}
        interviewId={interviewId}
        type="interview"
        questions={interview.questions}
      />
    </>
  );
};

export default InterviewDetails;
