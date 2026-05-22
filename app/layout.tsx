import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Mock Interviewer | Prepare for Technical & Behavioral Interviews",
  description: "Get hired faster by practicing technical and behavioral interviews with our adaptive local AI Mock Interviewer. Powered by Ollama.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-background text-textPrimary min-h-screen flex flex-col font-sans selection:bg-accent selection:text-white overflow-x-hidden antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
