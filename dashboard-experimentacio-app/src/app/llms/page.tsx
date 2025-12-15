import { LlmsTable } from "@/components/llms/LlmsTable";
import { CreateNewButton } from "@/components/ui/button";
import { Flex, Heading } from "@chakra-ui/react";

export default function ModelsPage() {
  return (
    <Flex direction="column" gap={4} p={4} w="full">
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          Models Management
        </Heading>
        <CreateNewButton
          href="/llms/new"
          label="Add Model"
        />
      </Flex>
      <LlmsTable />
    </Flex>
  );
}