"use client";

import {
  Flex,
  Heading,
  Text,
  Box,
  Code,
} from "@chakra-ui/react";
import { usePromptTemplate } from "./usePromptTemplate";


export default function TemplateDetails({ id }: { id: number }) {
  const { template: promptTemplate, isLoading, isError, error } =
    usePromptTemplate(id);

  if (isLoading || !promptTemplate) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="gray.600">Loading prompt template...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="red.500">
          Error loading prompt template: {error?.message ?? "Unknown error"}
        </Text>
      </Flex>
    );
  }

  const creationDate = promptTemplate.creation_date.slice(0, 10);

  return (
    <Flex direction="column" gap={4} p={4} w="full" mb={8}>
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          {promptTemplate.name}
        </Heading>
      </Flex>

      <Text>Created at: {creationDate}</Text>

      <Box>
        <Heading as="h2" size="md" mb={2}>
          System prompt
        </Heading>
        <Text whiteSpace="pre-wrap">{promptTemplate.system_prompt.text}</Text>
      </Box>

      <Box>
        <Heading as="h3" size="sm" mb={2}>
          System schema (JSON)
        </Heading>
        <Box
          p={3}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
          fontFamily="mono"
          fontSize="sm"
          maxH="300px"
          overflow="auto"
        >
          <Code whiteSpace="pre">
            {JSON.stringify(
              promptTemplate.system_prompt.schema,
              null,
              2,
            )}
          </Code>
        </Box>
      </Box>

      <Box>
        <Heading as="h2" size="md" mb={2}>
          User prompt
        </Heading>
        <Text whiteSpace="pre-wrap">{promptTemplate.user_prompt.text}</Text>
      </Box>
    </Flex>
  );
}
