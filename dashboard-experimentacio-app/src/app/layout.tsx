import type React from "react";
import type { Metadata } from "next";
import { Providers } from "@/providers";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";

export const metadata: Metadata = {
  title: "Experimentation Dashboard for LLM-powered Mobile App Recommender Systems",
  description: "Dashboard for experimenting with LLM-powered mobile app recommender systems",
};

export default function RootLayout({ 
  children,
 }: Readonly<{ 
  children: React.ReactNode 
}>) {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <Box>
            <Navbar />
            <Flex gap={4} h="100vh">
              <SideBar />
              {children}
            </Flex>
          </Box>
        </Providers>
      </body>
    </html>
  );
}