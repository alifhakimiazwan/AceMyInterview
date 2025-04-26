import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const { userId } = await auth();
  const isAuth = !!userId;
  return (
    <div className="root-layout">
      <nav className="flex items-center justify-between p-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <h2 className="text-primary-100 hidden md:block">AceMyInterview</h2>
          {/* Mobile title */}
          <h2 className="text-primary-100 block md:hidden">Ami</h2>{" "}
        </Link>

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-4 ml-auto">
          {!isAuth && (
            <>
              <Link href="/sign-in">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Create Account</Button>
              </Link>
            </>
          )}
          {isAuth && (
            <div className="flex items-center justify-center w-32 h-32 transform scale-150">
              <UserButton />
            </div>
          )}
        </div>
      </nav>

      {children}
    </div>
  );
};

export default RootLayout;
