import type React from "react";
import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { Box, Flex } from "@chakra-ui/react";
import Navbar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";

export const metadata: Metadata = {
  title: "Experimentation Dashboard",
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
        <Provider>
          <Box>
            <Navbar />
            <Flex gap={4} h="100vh">
              <SideBar />
              {children}
            </Flex>
          </Box>
        </Provider>
      </body>
    </html>
  );
}