import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/contexts/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "WODify - CrossFit WOD Generator",
  description: "Generate personalized CrossFit workouts with AI. Create custom WODs based on your fitness level, equipment, and goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 transition-colors duration-300">
        <ThemeProvider>
          <SessionProvider session={null}>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
