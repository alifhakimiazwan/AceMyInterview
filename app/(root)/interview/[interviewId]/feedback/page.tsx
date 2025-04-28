import { RouteParams } from "@/types";
import React from "react";
import { clerkClient, auth } from "@clerk/nextjs/server";
import { getFeedbackByInterviewId, getInterviewById } from "@/lib/actionDb";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";
import PieBreakdown from "@/components/PieBreakdown";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const Feedback = async ({ params }: RouteParams) => {
  const { interviewId } = await params;
  const { userId } = await auth();

  const client = await clerkClient();

  const user = await client.users.getUser(userId!);
  const interview = await getInterviewById(interviewId);
  const feedback = await getFeedbackByInterviewId({
    interviewId,
    userId,
  });
  console.log(feedback);
  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />
      <div className="flex flex-col gap-2">
        <h3>Feedback Summary</h3>
        <p>{feedback?.finalAssessment}</p>
      </div>

      {feedback?.categoryScores && (
        <PieBreakdown categoryScores={feedback.categoryScores} />
      )}

      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Performance Highlights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Strengths</h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {feedback?.strengths?.map((strength, index) => (
                  <div
                    key={index}
                    className="text-white-700 border border-gray-600 rounded-md p-5 text-sm"
                  >
                    {strength}
                  </div>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Areas for Improvement Card */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-bold">Areas for Improvement</h3>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2">
                {feedback?.areasForImprovement?.map((area, index) => (
                  <div
                    key={index}
                    className="text-white-700 border border-gray-600 rounded-md p-5 text-sm"
                  >
                    {area}
                  </div>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${interviewId}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
