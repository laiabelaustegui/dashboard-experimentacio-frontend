"use client";

import {
  Flex,
  Heading,
  Text,
  Box,
  Code,
  Card,
  Stack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { usePromptTemplate } from "./usePromptTemplate";


export default function TemplateDetails({ id }: { id: number }) {
  const { template: promptTemplate, isLoading, isError, error } =
    usePromptTemplate(id);

  if (isLoading || !promptTemplate) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="fg.muted">Loading prompt template...</Text>
      </Flex>
    );
  }

  if (isError) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="fg.error">
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
          rounded="md"
          bg="bg.subtle"
          fontFamily="mono"
          textStyle="sm"
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
        <Text whiteSpace="pre-wrap" mb={4}>{promptTemplate.user_prompt.text}</Text>
        
        {/* User Prompt Configuration */}
        <Card.Root mb={3}>
          <Card.Body>
            <Stack gap={3}>
              <Heading as="h3" size="sm">
                Configuration
              </Heading>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb={1}>
                    Number of recommendations (k)
                  </Text>
                  <Text fontWeight="semibold">
                    {promptTemplate.user_prompt.k ?? "Not specified"}
                  </Text>
                </Box>
                <Box>
                  <Text textStyle="sm" color="fg.muted" mb={1}>
                    Features count
                  </Text>
                  <Text fontWeight="semibold">
                    {promptTemplate.user_prompt.features?.length ?? 0}
                  </Text>
                </Box>
              </SimpleGrid>
            </Stack>
          </Card.Body>
        </Card.Root>

        {/* Features */}
        {promptTemplate.user_prompt.features && promptTemplate.user_prompt.features.length > 0 && (
          <Box>
            <Heading as="h3" size="sm" mb={2}>
              Selected Features
            </Heading>
            <Flex gap={2} wrap="wrap">
              {promptTemplate.user_prompt.features.map((feature) => (
                <Badge
                  key={feature.id}
                  colorPalette="blue"
                  size="lg"
                  px={3}
                  py={1}
                >
                  <Stack gap={0}>
                    <Text fontWeight="semibold">{feature.name}</Text>
                    {feature.description && (
                      <Text textStyle="xs" color="fg.muted">
                        {feature.description}
                      </Text>
                    )}
                  </Stack>
                </Badge>
              ))}
            </Flex>
          </Box>
        )}
      </Box>
    </Flex>
  );
}
