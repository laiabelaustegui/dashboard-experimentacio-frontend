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
  Text,
  Textarea,
} from "@chakra-ui/react";

import apiProvider from "@/providers/api";
import type { CreatePromptTemplateDto, CreateFeatureDto } from "@/models/promptTemplate";

export function TemplateForm() {
  const [schemaJson, setSchemaJson] = useState("");
  const router = useRouter();

  const [features, setFeatures] = useState<CreateFeatureDto[]>([]);
  const [newFeature, setNewFeature] = useState<CreateFeatureDto>({ name: "", description: "" });

  const handleCancel = () => {
    router.push("/prompt-templates");
  };

  const handleSchemaFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      try {
        const parsed = JSON.parse(text);
        setSchemaJson(JSON.stringify(parsed, null, 2)); // lo muestras
      } catch (err) {
        console.error("JSON inválido", err);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Acceso directo a valores del form
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const systemPrompt = (form.elements.namedItem("systemPrompt") as HTMLTextAreaElement).value;
    const userPrompt = (form.elements.namedItem("userPrompt") as HTMLTextAreaElement).value;
    const kValue = (form.elements.namedItem("k") as HTMLInputElement).value;

    // Construcción del DTO
    const dto: CreatePromptTemplateDto = {
      name,
      system_prompt: {
        text: systemPrompt,
        schema: JSON.parse(schemaJson), // JSON del fichero, tal cual
      },
      user_prompt: {
        text: userPrompt,
        k: kValue ? Number(kValue) : undefined,
        features: features.length > 0 ? features : undefined,
      },
    };

    try {
      await apiProvider.post({
        path: "/prompt-templates/",
        body: dto,
      });

      router.push("/prompt-templates");
    } catch (error) {
      console.error("Error creating template", error);
      // aquí puedes poner un toast o notificación
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={6} maxW="2xl">
        {/* Template details */}
        <Fieldset.Root size="lg">
          <Stack mb={2}>
            <Fieldset.Legend>Template Details</Fieldset.Legend>
            <Fieldset.HelperText>
              Provide a name for the prompt template.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input name="name" placeholder="Template name" />
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

        {/* System prompt */}
        <Fieldset.Root size="lg">
          <Stack mb={2}>
            <Fieldset.Legend>System Prompt</Fieldset.Legend>
            <Fieldset.HelperText>
              Define the system prompt and its JSON schema.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Stack gap={4}>
              <Field.Root>
                <Field.Label>System Prompt Text</Field.Label>
                <Textarea
                  name="systemPrompt"
                  placeholder="System prompt text"
                  rows={5}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Schema (JSON)</Field.Label>
                <Input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleSchemaFileChange}
                />

                <Textarea
                  name="systemSchema"
                  rows={8}
                  value={schemaJson}
                  onChange={(e) => setSchemaJson(e.target.value)}
                />
              </Field.Root>
            </Stack>
          </Fieldset.Content>
        </Fieldset.Root>

        {/* User prompt */}
        <Fieldset.Root size="lg">
          <Stack mb={2}>
            <Fieldset.Legend>User Prompt</Fieldset.Legend>
            <Fieldset.HelperText>
              Define the user prompt text and the features for the template.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root>
              <Field.Label>User Prompt Text</Field.Label>
              <Textarea
                name="userPrompt"
                placeholder="Recommend {{ k }} apps for {{ feature }}."
                rows={3}
              />
            </Field.Root>
            {/* k opcional */}
            <Field.Root>
              <Field.Label>k (optional)</Field.Label>
              <Input
                name="k"
                type="number"
                placeholder="Number of apps to recommend"
              />
            </Field.Root>

            {/* Features */}
            <Field.Root>
              <Field.Label>Features</Field.Label>
              <Stack gap={2}>
                <Input
                  placeholder="Feature name (e.g. Build photo collages)"
                  value={newFeature.name}
                  onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                />
                <Input
                  placeholder="Feature description (optional)"
                  value={newFeature.description || ""}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                />
                <Button
                  type="button"
                  alignSelf="flex-start"
                  onClick={() => {
                    if (!newFeature.name.trim()) return;
                    setFeatures((prev) => [...prev, { 
                      name: newFeature.name.trim(), 
                      description: newFeature.description?.trim() || undefined 
                    }]);
                    setNewFeature({ name: "", description: "" });
                  }}
                >
                  Add
                </Button>
              </Stack>
              {/* Lista de features añadidas */}
              <Stack mt={2}>
                {features.map((feat, idx) => (
                  <Stack
                    key={`${feat.name}-${idx}`}
                    direction="row"
                    justify="space-between"
                    align="center"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                  >
                    <Stack gap={0}>
                      <Text fontWeight="semibold">{feat.name}</Text>
                      {feat.description && (
                        <Text textStyle="sm" color="fg.muted">
                          {feat.description}
                        </Text>
                      )}
                    </Stack>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() =>
                        setFeatures((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

        <Stack alignSelf="flex-start">
          <ButtonGroup gap={4}>
            <Button type="submit" colorPalette="blue">
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
