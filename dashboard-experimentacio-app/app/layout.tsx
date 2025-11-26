import type React from "react";
import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Mi dashboard",
  description: "Dashboard con Next y Chakra",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <Provider>
          <Flex h="100vh">
            {/* Navbar izquierda global */}
            <Box
              as="nav"
              w="64"
              bg="gray.900"
              color="white"
              p={4}
              display="flex"
              flexDirection="column"
              gap={4}
            >
              <Heading size="md">Mi App</Heading>
              <Text fontSize="sm" color="gray.300">
                Navegación global
              </Text>
              {/* Aquí luego pondrás los links */}
            </Box>

            {/* Zona derecha: header + contenido de cada página */}
            <Flex direction="column" flex="1">
              {/* Header superior global */}
              <Box
                as="header"
                h="16"
                borderBottomWidth="1px"
                px={6}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bg="white"
              >
                <Heading size="md">Título general</Heading>
                <Text color="gray.500" fontSize="sm">
                  Info usuario / acciones
                </Text>
              </Box>

              {/* Contenido específico de cada página */}
              <Box as="main" flex="1" p={6} bg="gray.50" overflow="auto">
                {children}
              </Box>
            </Flex>
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
