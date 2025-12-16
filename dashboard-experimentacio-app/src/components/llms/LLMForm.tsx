"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ButtonGroup,
  Field,
  Fieldset,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";

import apiProvider from "@/providers/api";
import { CreateLLMDto } from "@/model/LLM";

export function LLMForm() {
  const router = useRouter();

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

    try {
      await apiProvider.post({
        path: "/llms/",
        body: dto,
      });

      router.push("/llms");
    } catch (error) {
      console.error("Error adding LLM", error);
      // aquí puedes poner un toast o notificación
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={6} maxW="2xl">
        {/* Template details */}
        <Fieldset.Root size="lg">
          <Stack mb={2}>
            <Fieldset.Legend>Register New Model</Fieldset.Legend>
            <Fieldset.HelperText>
              Provide complete the following details to add a new LLM model.
            </Fieldset.HelperText>
          </Stack>

            <Fieldset.Content>
                <Field.Root>
                <Field.Label>Name</Field.Label>
                <Input name="name" placeholder="Model name" />
                </Field.Root>
            </Fieldset.Content>

            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>Provider</Field.Label>
                    <Input name="provider" placeholder="Model provider" />
                </Field.Root>
            </Fieldset.Content>

            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>API Endpoint</Field.Label>
                    <Input name="API_endpoint" placeholder="https://api.example.com/v1" />
                </Field.Root>
            </Fieldset.Content>

            <Fieldset.Content>
                <Field.Root>
                    <Field.Label>API Key</Field.Label>
                    <Textarea
                    name="API_key"
                    placeholder="Your API key"
                    rows={3}          // 1–2 líneas
                    resize="vertical" // o "none" si no quieres que se redimensione
                    />
                </Field.Root>
            </Fieldset.Content>

        </Fieldset.Root>

        <Stack alignSelf="flex-start">
          <ButtonGroup gap={4}>
            <Button type="submit" colorScheme="blue">
              Submit
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </ButtonGroup>
        </Stack>
      </Stack>
    </form>
  );
}
