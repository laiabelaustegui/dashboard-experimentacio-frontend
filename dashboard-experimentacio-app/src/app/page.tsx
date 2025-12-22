"use client";

import { Flex, SimpleGrid, Text } from "@chakra-ui/react";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { ExperimentsTable } from "@/components/experiments/ExperimentsTable";

export default function HomePage() {
  return (
    <Flex direction="column" gap={8} p={4} w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <QuickActionCard
          title="Large Language Models (LLMs)"
          actions={[
            { href: "/llms/new", label: "Add new model", props: { colorScheme: "teal" } },
            { href: "/llms", label: "See models", props: { variant: "outline" } },
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
      <Text> Recent Experiments</Text>
      <ExperimentsTable />
    </Flex>
  );
}
