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
  Button,
  IconButton,
} from "@chakra-ui/react";
import { IoPencil } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePromptTemplate } from "./usePromptTemplate";
import { Tooltip } from "@/components/ui/tooltip";


export default function TemplateDetails({ id }: { id: number }) {
  const router = useRouter();
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

  const creationDate = new Date(promptTemplate.creation_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Flex direction="column" align="center" p={4} w="full" mb={8}>
      <Stack gap={6} w="full" maxW="5xl">
        <Link href="/prompt-templates" style={{ alignSelf: "flex-start" }}>
          <Button 
            as="span"
            variant="ghost"
          >
            ← Back to Prompt Templates
          </Button>
        </Link>
        
        <Card.Root variant="elevated">
          <Card.Header>
            <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
              <Box flex="1">
                <Card.Title fontSize="2xl">
                  {promptTemplate.name}
                </Card.Title>
                <Card.Description mt={2}>
                  Created on {creationDate}
                </Card.Description>
              </Box>
              <Flex align="center" gap={3}>
                {promptTemplate.experiments_count !== undefined && (
                  <Badge 
                    colorPalette={promptTemplate.experiments_count > 0 ? "red" : "teal"} 
                    size="lg"
                    variant="subtle"
                  >
                    {promptTemplate.experiments_count} Experiment{promptTemplate.experiments_count !== 1 ? 's' : ''}
                  </Badge>
                )}
                <Tooltip
                  content={
                    promptTemplate.experiments_count && promptTemplate.experiments_count > 0
                      ? `Cannot edit: this template is used by ${promptTemplate.experiments_count} experiment(s)`
                      : "Edit template"
                  }
                >
                  <IconButton
                    aria-label="Edit template"
                    size="lg"
                    variant="outline"
                    colorPalette="teal"
                    disabled={promptTemplate.experiments_count ? promptTemplate.experiments_count > 0 : false}
                    onClick={() => router.push(`/prompt-templates/${id}/edit`)}
                  >
                    <IoPencil />
                  </IconButton>
                </Tooltip>
              </Flex>
            </Flex>
          </Card.Header>

          <Card.Body>
            <Stack gap={6}>
              {/* System Prompt Section */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  System Prompt
                </Text>
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="bg.muted"
                  mb={4}
                >
                  <Text whiteSpace="pre-wrap">{promptTemplate.system_prompt.text}</Text>
                </Box>
                
                <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={2}>
                  JSON Schema
                </Text>
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="bg.subtle"
                  fontFamily="mono"
                  fontSize="sm"
                  maxH="400px"
                  overflow="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'var(--chakra-colors-border)',
                      borderRadius: '4px',
                    },
                  }}
                >
                  <Code whiteSpace="pre" bg="transparent">
                    {JSON.stringify(
                      promptTemplate.system_prompt.schema,
                      null,
                      2,
                    )}
                  </Code>
                </Box>
              </Box>

              {/* User Prompt Section */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={3}>
                  User Prompt
                </Text>
                <Box
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  bg="bg.muted"
                  mb={4}
                >
                  <Text whiteSpace="pre-wrap">{promptTemplate.user_prompt.text}</Text>
                </Box>
                
                {/* Configuration Card */}
                <Card.Root variant="subtle" borderWidth="1px" borderColor="teal.500/20" mb={4}>
                  <Card.Body py={3}>
                    <Text fontSize="sm" fontWeight="semibold" mb={3}>
                      Configuration
                    </Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                      <Box>
                        <Text fontSize="xs" color="fg.muted" mb={1}>
                          Number of recommendations (k)
                        </Text>
                        <Badge colorPalette="teal" variant="subtle" size="lg">
                          {promptTemplate.user_prompt.k ?? "Not specified"}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color="fg.muted" mb={1}>
                          Features count
                        </Text>
                        <Badge colorPalette="teal" variant="outline" size="lg">
                          {promptTemplate.user_prompt.features?.length ?? 0}
                        </Badge>
                      </Box>
                    </SimpleGrid>
                  </Card.Body>
                </Card.Root>

                {/* Features */}
                {promptTemplate.user_prompt.features && promptTemplate.user_prompt.features.length > 0 && (
                  <Box>
                    <Text fontSize="sm" fontWeight="medium" color="fg.muted" mb={3}>
                      Features
                    </Text>
                    <Stack gap={2}>
                      {promptTemplate.user_prompt.features.map((feature) => (
                        <Card.Root
                          key={feature.id}
                          size="sm"
                          variant="subtle"
                          borderWidth="1px"
                          borderColor="teal.500/20"
                        >
                          <Card.Body py={3}>
                            <Stack gap={1}>
                              <Text fontWeight="semibold" fontSize="sm">
                                {feature.name}
                              </Text>
                              {feature.description && (
                                <Text fontSize="xs" color="fg.muted">
                                  {feature.description}
                                </Text>
                              )}
                            </Stack>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Flex>
  );
}
