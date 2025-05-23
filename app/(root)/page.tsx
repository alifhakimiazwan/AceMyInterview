import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actionDb";
import { auth, clerkClient } from "@clerk/nextjs/server";

async function Home() {
  const { userId } = await auth();

  let user = null;
  let userInterviews = [];
  let allInterview = [];

  if (userId) {
    const client = await clerkClient();
    user = await client.users.getUser(userId);

    [userInterviews, allInterview] = await Promise.all([
      getInterviewsByUserId(user.id),
      getLatestInterviews(user.id),
    ]);
  }

  const hasPastInterviews = userInterviews.length > 0;
  const hasUpcomingInterviews = allInterview.length > 0;

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>
          <p className="text-lg">
            Practice real interview questions & get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href={user ? "/interview" : "/sign-in"}>
              {user ? "Start an Interview" : "Start Now"}
            </Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Your Interviews Section (Only if signed in) */}
      {user && (
        <>
          <section className="flex flex-col gap-6 mt-8">
            <h2>Your Interviews</h2>

            <div className="interviews-section">
              {hasPastInterviews ? (
                userInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <p>You haven&apos;t taken any interviews yet</p>
              )}
            </div>
          </section>

          {/* Take Interviews Section */}
          <section className="flex flex-col gap-6 mt-8">
            <h2>Take Interviews</h2>

            <div className="interviews-section">
              {hasUpcomingInterviews ? (
                allInterview.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user.id}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <p>There are no interviews available</p>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}

export default Home;
