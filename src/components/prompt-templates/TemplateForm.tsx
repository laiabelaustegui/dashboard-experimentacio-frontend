"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Field,
  Fieldset,
  Flex,
  IconButton,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";
import type { CreatePromptTemplateDto, CreateFeatureDto, PromptTemplate } from "@/models/promptTemplate";

interface TemplateFormProps {
  initialData?: PromptTemplate;
  templateId?: number; // ID del template si estamos en modo edición
}

export function TemplateForm({ initialData, templateId }: TemplateFormProps) {
  const [schemaJson, setSchemaJson] = useState(initialData ? JSON.stringify(initialData.system_prompt.schema, null, 2) : "");
  const router = useRouter();
  const isEditMode = !!templateId;

  const [features, setFeatures] = useState<CreateFeatureDto[]>(initialData?.user_prompt.features || initialData?.user_prompt.features || []);
  const [newFeature, setNewFeature] = useState<CreateFeatureDto>({ name: "" });
  const [name, setName] = useState(initialData?.name || "");
  const [systemPrompt, setSystemPrompt] = useState(initialData?.system_prompt.text || "");
  const [userPrompt, setUserPrompt] = useState(initialData?.user_prompt.text || "");
  const [kValue, setKValue] = useState(initialData?.user_prompt.k?.toString() || "");

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
      if (isEditMode && templateId) {
        // Modo edición: usar PUT o PATCH
        await apiProvider.put({
          path: `/prompt-templates/${templateId}/`,
          body: dto,
        });

        toaster.create({
          title: "Template updated",
          description: "The prompt template has been successfully updated.",
          type: "success",
          duration: 3000,
        });
        
        router.push("/prompt-templates");
      } else {
        // Modo creación: usar POST
        const createdTemplate = await apiProvider.post<PromptTemplate>({
          path: "/prompt-templates/",
          body: dto,
        });

        toaster.create({
          title: "Template created",
          description: "The prompt template has been successfully created.",
          type: "success",
          duration: 3000,
        });
        
        // Redirigir a la página de detalles del template creado
        router.push(`/prompt-templates/${createdTemplate.id}`);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: isEditMode ? "Error updating template" : "Error creating template",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: isEditMode ? "Error updating template" : "Error creating template",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error(isEditMode ? "Error updating template:" : "Error creating template:", error);
    }
  };

  return (
    <Card.Root
      asChild
      maxW="5xl"
      mt={8}
      variant="elevated"
    >
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title fontSize="2xl">
            {isEditMode ? "Edit Prompt Template" : "Create New Prompt Template"}
          </Card.Title>
          <Card.Description mt={2} color="fg.muted">
            {isEditMode 
              ? "Modify the template details below." 
              : "Please complete the following information to create a new prompt template."}
          </Card.Description>
        </Card.Header>
        
        <Card.Body>
          <Stack gap={8}>
            {/* Template details */}
            <Fieldset.Root size="lg" colorPalette="teal">
              <Stack gap={4}>
                <Fieldset.Legend fontSize="lg" fontWeight="semibold">Template Details</Fieldset.Legend>
                <Fieldset.HelperText color="fg.muted">
                  Provide a name for the prompt template.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content mt={6}>
                <Field.Root>
                  <Field.Label fontWeight="medium">Name</Field.Label>
                  <Input 
                    name="name" 
                    placeholder="Enter template name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    size="md"
                    required
                  />
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>

            {/* System prompt */}
            <Fieldset.Root size="lg" colorPalette="teal">
              <Stack gap={4}>
                <Fieldset.Legend fontSize="lg" fontWeight="semibold">System Prompt</Fieldset.Legend>
                <Fieldset.HelperText color="fg.muted">
                  Define the system prompt and its JSON schema.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content mt={6}>
                <Stack gap={4}>
                  <Field.Root>
                    <Field.Label fontWeight="medium">System Prompt Text</Field.Label>
                    <Field.HelperText mt={1} mb={2}>
                      Define how the AI should behave
                    </Field.HelperText>
                    <Textarea
                      name="systemPrompt"
                      placeholder="You are a helpful assistant..."
                      rows={5}
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      size="md"
                      required
                    />
                  </Field.Root>

                  <Field.Root>
                    <Field.Label fontWeight="medium">Schema (JSON)</Field.Label>
                    <Field.HelperText mt={1} mb={2}>
                      Upload a JSON file or paste the schema directly
                    </Field.HelperText>
                    <Input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleSchemaFileChange}
                      size="md"
                      mb={2}
                    />

                    <Textarea
                      name="systemSchema"
                      rows={8}
                      value={schemaJson}
                      onChange={(e) => setSchemaJson(e.target.value)}
                      placeholder='{\n  "type": "object",\n  "properties": {}\n}'
                      fontFamily="mono"
                      fontSize="sm"
                      size="md"
                      required
                    />
                  </Field.Root>
                </Stack>
              </Fieldset.Content>
            </Fieldset.Root>

            {/* User prompt */}
            <Fieldset.Root size="lg" colorPalette="teal">
              <Stack gap={4}>
                <Fieldset.Legend fontSize="lg" fontWeight="semibold">User Prompt</Fieldset.Legend>
                <Fieldset.HelperText color="fg.muted">
                  Define the user prompt text and the features for the template.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content mt={6}>
                <Field.Root>
                  <Field.Label fontWeight="medium">User Prompt Text</Field.Label>
                  <Field.HelperText mt={1} mb={2}>
                    Use placeholders like {"{{ k }}"} and {"{{ feature }}"}
                  </Field.HelperText>
                  <Textarea
                    name="userPrompt"
                    placeholder="Recommend {{ k }} apps for {{ feature }}."
                    rows={3}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    size="md"
                    required
                  />
                </Field.Root>
                {/* k opcional */}
                <Field.Root>
                  <Field.Label fontWeight="medium">k (optional)</Field.Label>
                  <Field.HelperText mt={1} mb={2}>
                    Number of items to recommend (minimum: 1)
                  </Field.HelperText>
                  <Input
                    name="k"
                    type="number"
                    placeholder="e.g. 5"
                    value={kValue}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Permitir vacío o valores >= 1
                      if (value === '' || (Number(value) >= 1 && !value.includes('-'))) {
                        setKValue(value);
                      }
                    }}
                    size="md"
                    min={1}
                  />
                </Field.Root>

                {/* Features */}
                <Field.Root>
                  <Field.Label fontWeight="medium">Features</Field.Label>
                  <Field.HelperText mt={1} mb={3}>
                    Add features that will be used in the user prompt
                  </Field.HelperText>
                  
                  {/* Lista de features añadidas */}
                  {features.length > 0 && (
                    <Stack gap={3} mb={3}>
                      {features.map((feat, idx) => (
                        <Card.Root
                          key={`${feat.name}-${idx}`}
                          size="sm"
                          variant="subtle"
                          borderWidth="1px"
                          borderColor="teal.500/20"
                        >
                          <Card.Body py={3}>
                            <Flex justify="space-between" align="center" gap={4}>
                              <Text fontWeight="semibold" fontSize="sm" flex="1">
                                {feat.name}
                              </Text>
                              <IconButton
                                aria-label="Remove feature"
                                size="sm"
                                variant="ghost"
                                colorPalette="red"
                                onClick={() =>
                                  setFeatures((prev) => prev.filter((_, i) => i !== idx))
                                }
                              >
                                <LuX />
                              </IconButton>
                            </Flex>
                          </Card.Body>
                        </Card.Root>
                      ))}
                    </Stack>
                  )}

                  <Input
                    placeholder="Enter feature name (e.g. Build photo collages)"
                    value={newFeature.name}
                    onChange={(e) => setNewFeature({ name: e.target.value })}
                    size="md"
                    mb={2}
                  />
                  <Button
                    type="button"
                    alignSelf="flex-start"
                    colorPalette="teal"
                    variant="outline"
                    size="md"
                    onClick={() => {
                      if (!newFeature.name.trim()) return;
                      setFeatures((prev) => [...prev, { 
                        name: newFeature.name.trim()
                      }]);
                      setNewFeature({ name: "" });
                    }}
                  >
                    Add Feature
                  </Button>
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>
          </Stack>
        </Card.Body>

        <Card.Footer justifyContent="flex-end" gap={3}>
          <Button 
            type="button" 
            variant="outline" 
            size="lg"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            colorPalette="teal"
            size="lg"
          >
            {isEditMode ? "Update Template" : "Create Template"}
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  );
}
