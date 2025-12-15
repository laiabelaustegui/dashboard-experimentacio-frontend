"use client";

import { Flex, SimpleGrid } from "@chakra-ui/react";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";

export default function HomePage() {
  return (
    <Flex direction="column" gap={8}>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <QuickActionCard
          title="Large Language Models (LLMs)"
          actions={[
            { href: "/models/new", label: "Add new model", props: { colorScheme: "teal" } },
            { href: "/models", label: "See models", props: { variant: "outline" } },
          ]}
        />
        <QuickActionCard
          title="Prompt Templates"
          actions={[
            { href: "/prompt-templates/new", label: "Create template", props: { colorScheme: "teal" } },
            { href: "/prompt-templates", label: "See templates", props: { variant: "outline" } },
          ]}
        />
        <QuickActionCard
          title="Experimentation"
          actions={[
            { href: "/experiments/new", label: "Create experiment", props: { colorScheme: "teal" } },
            { href: "/experiments", label: "See recent experiments", props: { variant: "outline" } },
          ]}
        />
      </SimpleGrid>
    </Flex>
  );
}
