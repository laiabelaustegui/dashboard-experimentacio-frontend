"use client";

import {
  Flex,
  Text,
  Button,
  Box,
  Stack,
  Card,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { usePromptTemplate } from "./usePromptTemplate";
import { TemplateForm } from "./TemplateForm";

export default function TemplateEdit({ id }: { id: number }) {
  const router = useRouter();
  const { template: promptTemplate, isLoading, isError, error } = usePromptTemplate(id);

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

  // Verificar si el template tiene experimentos asociados
  if (promptTemplate.experiments_count && promptTemplate.experiments_count > 0) {
    return (
      <Flex direction="column" align="center" p={4} w="full">
        <Stack gap={4} w="full" maxW="5xl">
          <Button 
            variant="ghost"
            alignSelf="flex-start"
            onClick={() => router.push("/prompt-templates")}
          >
            ← Back to Prompt Templates
          </Button>
          
          <Card.Root variant="elevated" maxW="5xl">
            <Card.Header>
              <Card.Title fontSize="2xl" color="fg.error">
                Cannot Edit Template
              </Card.Title>
              <Card.Description mt={2}>
                This template cannot be modified because it has associated experiments.
              </Card.Description>
            </Card.Header>
            
            <Card.Body>
              <Box 
                p={4} 
                borderWidth="1px" 
                borderRadius="md" 
                borderColor="border.error"
                bg="bg.error.subtle"
              >
                <Text fontWeight="semibold" mb={2}>
                  Template: <strong>{promptTemplate.name}</strong>
                </Text>
                <Text>
                  This template is currently being used by{" "}
                  <strong>{promptTemplate.experiments_count} experiment(s)</strong>.
                </Text>
                <Text mt={2}>
                  To edit this template, you must first delete all associated experiments, or you can duplicate this template to create a new editable version.
                </Text>
              </Box>
            </Card.Body>

            <Card.Footer justifyContent="flex-start">
              <Button 
                colorPalette="teal" 
                size="lg"
                onClick={() => router.push(`/prompt-templates/new?duplicate=${id}`)}
              >
                Duplicate Template Instead
              </Button>
            </Card.Footer>
          </Card.Root>
        </Stack>
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" p={4} w="full" mb={8}>
      <Stack gap={4} w="full" maxW="5xl">
        <Button 
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => router.push("/prompt-templates")}
        >
          ← Back to Prompt Templates
        </Button>
        
        <TemplateForm initialData={promptTemplate} templateId={id} />
      </Stack>
    </Flex>
  );
}
