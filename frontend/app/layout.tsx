import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindfulAI | Your Emotional Intelligence Operating System",
  description: "Multimodal AI therapy, forensics, and guided wellness.",
};

import { MUIProvider } from "@/components/providers/mui-provider";
import { ThemeProvider } from "next-themes";
import { NeuralBackground } from "@/components/ui/neural-background";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NeuralBackground />
        <ThemeProvider attribute="class" defaultTheme="light">
          <MUIProvider>
            {children}
          </MUIProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
