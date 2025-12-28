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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <body>
        <Providers>
          <Flex direction="column" h="100vh">
            <Navbar />
            <Flex flex="1" overflow="hidden">
              <SideBar />
              <Box flex="1" overflowY="auto">
                {children}
              </Box>
            </Flex>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}

