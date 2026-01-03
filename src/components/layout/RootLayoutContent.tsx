'use client'

import { Box, Flex } from "@chakra-ui/react";
import Navbar from "@/components/layout/NavBar";
import SideBar from "@/components/layout/SideBar";

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1" overflow="hidden">
        <SideBar />
        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
