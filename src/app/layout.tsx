import type React from "react";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import RootLayoutContent from "@/components/layout/RootLayoutContent";

export const metadata: Metadata = {
  title: "Experimentation Dashboard for LLM-powered Mobile App Recommender Systems",
  description: "Dashboard for experimenting with LLM-powered mobile app recommender systems",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <Providers>
          <RootLayoutContent>{children}</RootLayoutContent>
        </Providers>
      </body>
    </html>
  );
}

