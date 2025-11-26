"use client";

import { Heading, Text } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <>
      <Heading size="lg" mb={4}>
        Página principal
      </Heading>
      <Text color="gray.600">
        Aquí puedes mostrar el resumen inicial del dashboard.
      </Text>
    </>
  );
}
