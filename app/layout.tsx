import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import localFont from "next/font/local";

const telegraf = localFont({
  src: "./fonts/TelegrafRegular.otf",
  variable: "--font-telegraf",
});

export const metadata: Metadata = {
  title: "AceMyInterview",
  description: "AI powered interview preparation platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${telegraf.className} antialiased pattern`}>
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
