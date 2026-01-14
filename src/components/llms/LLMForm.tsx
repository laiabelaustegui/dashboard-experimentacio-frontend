"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Field,
  Fieldset,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";

import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";
import { CreateLLMDto } from "@/models/LLM";

export function LLMForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCancel = () => {
    router.push("/llms");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Acceso directo a valores del form
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const provider = (form.elements.namedItem("provider") as HTMLInputElement).value;
    const API_endpoint = (form.elements.namedItem("API_endpoint") as HTMLInputElement).value;
    const API_key = (form.elements.namedItem("API_key") as HTMLInputElement).value;

    // Construcción del DTO
    const dto: CreateLLMDto = {
        name,
        provider,
        API_endpoint,
        API_key
    };

    setIsSubmitting(true);
    try {
      await apiProvider.post({
        path: "/llms/",
        body: dto,
      });

      toaster.create({
        title: "LLM added",
        description: "The LLM has been successfully added.",
        type: "success",
        duration: 3000,
      });

      router.push("/llms");
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error adding LLM",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error adding LLM",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error adding LLM:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card.Root
      asChild
      maxW="5xl"
      mx="auto"
      mt={8}
      variant="elevated"
    >
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title fontSize="2xl">Register New Base Model</Card.Title>
          <Card.Description mt={2} color="fg.muted">
            Please complete the following details to add a new LLM base model.
          </Card.Description>
        </Card.Header>
        
        <Card.Body>
          <Fieldset.Root size="lg" colorPalette="teal">
            <Stack gap={4}>
              <Fieldset.Legend fontSize="lg" fontWeight="semibold">Model Information</Fieldset.Legend>
              <Fieldset.HelperText color="fg.muted">
                Provide the essential information for the new base model.
              </Fieldset.HelperText>
            </Stack>

            <Fieldset.Content mt={6}>
              <Field.Root>
                <Field.Label fontWeight="medium">Name</Field.Label>
                <Input 
                  name="name" 
                  placeholder="Enter model name" 
                  size="md"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="medium">Provider</Field.Label>
                <Input 
                  name="provider" 
                  placeholder="Enter provider name (e.g., OpenAI, Anthropic)" 
                  size="md"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="medium">API Endpoint</Field.Label>
                <Input 
                  name="API_endpoint" 
                  placeholder="https://api.example.com/v1" 
                  size="md"
                  required
                />
              </Field.Root>

              <Field.Root>
                <Field.Label fontWeight="medium">API Key</Field.Label>
                <Textarea
                  name="API_key"
                  placeholder="Enter your API key"
                  rows={3}
                  resize="vertical"
                  size="md"
                  required
                />
              </Field.Root>
            </Fieldset.Content>
          </Fieldset.Root>
        </Card.Body>

        <Card.Footer justifyContent="flex-end" gap={3}>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            colorPalette="teal"
            size="lg"
            loading={isSubmitting}
            loadingText="Adding model..."
          >
            Add Model
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
