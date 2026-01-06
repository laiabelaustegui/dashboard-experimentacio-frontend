import { LlmsTabs } from "@/components/llms/LlmsTabs";
import { Flex, Heading, Text, Stack } from "@chakra-ui/react";

export default function ModelsPage() {
  return (
    <Flex direction="column" gap={4} p={4} w="full">
      <Stack gap={2}>
        <Heading as="h1" size="lg">
          Models Management
        </Heading>
        <Text color="fg.muted">
          Configure and manage LLM (Large Language Model) instances for your experiments. 
          To run an experiment, you need to create a <Text as="span" fontWeight="medium">configured model</Text> by 
          adding a configuration to a base model. Each configuration defines specific parameters 
          like temperature or top P that will be used during experiment execution.
        </Text>
      </Stack>
      <LlmsTabs />
    </Flex>
  );
}