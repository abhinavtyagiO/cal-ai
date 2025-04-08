import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SessionTimeoutProvider from "@/components/providers/SessionTimeoutProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cal-AI - Fitness Calorie Tracker",
  description: "Track your calories and optimize your diet with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionTimeoutProvider>
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </SessionTimeoutProvider>
      </body>
    </html>
  );
}
