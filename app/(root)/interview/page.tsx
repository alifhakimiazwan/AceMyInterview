import { auth, clerkClient } from "@clerk/nextjs/server";
import Agent from "@/components/Agent";
import React from "react";

const InterviewPage = async () => {
  const { userId } = await auth();

  let user = null;
  if (userId) {
    const client = await clerkClient();
    user = await client.users.getUser(userId);
  }

  if (!userId) {
    return <div>Please login to access the interview page.</div>;
  }

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
