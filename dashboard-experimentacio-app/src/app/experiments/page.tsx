import { ExperimentsTable } from "@/components/experiments/ExperimentsTable";
import { CreateNewButton } from "@/components/ui/button";
import { Flex, Heading } from "@chakra-ui/react";

export default function ExperimentsPage() {
  return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Experiments
          </Heading>
          <CreateNewButton
            href="/experiments/new"
            label="New Experiment"
          />
        </Flex>
        <ExperimentsTable />
      </Flex>
  );  
}