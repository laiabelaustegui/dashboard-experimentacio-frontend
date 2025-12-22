import { Flex, Heading } from "@chakra-ui/react";

export default function PromptTemplateDetailsPage() {
  return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Prompt Template Details
          </Heading>
        </Flex>
      </Flex>
  );  
}