import { auth, clerkClient } from "@clerk/nextjs/server";
import Agent from "@/components/Agent";
import React from "react";

const InterviewPage = async () => {
  const { userId } = await auth(); // no await here

  if (!userId) {
    return <div>Please login to access the interview page.</div>;
  }
  const client = await clerkClient();

  const user = await client.users.getUser(userId);

  return (
    <>
      <h3>Interview Generation</h3>
      <Agent
        userName={user?.firstName || "You"}
        userId={user?.id}
        type="generate"
      />
    </>
  );
};

export default InterviewPage;
