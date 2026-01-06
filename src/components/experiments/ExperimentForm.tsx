// components/experiments/CreateExperimentForm.tsx
"use client";

import {
  Badge,
  Button,
  Card,
  Combobox,
  Field,
  Fieldset,
  Flex,
  IconButton,
  Input,
  NativeSelect,
  NumberInput,
  Stack,
  Text,
  useFilter,
  createListCollection,
} from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { useState, FormEvent, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { CreateExperimentDto } from "@/models/experiment";
import { useConfiguredModels } from "@/components/configured-models/useConfiguredModels";
import { usePromptTemplates } from "@/components/prompt-templates/usePromptTemplates";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

export const ExperimentForm = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [promptTemplateId, setPromptTemplateId] = useState<number | "">("");
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);
  const [numRuns, setNumRuns] = useState("1");
  const [isExecuting, setIsExecuting] = useState(false);

  const { configuredModels, isLoading: loadingModels } = useConfiguredModels();
  const { templates, isLoading: loadingPrompts } = usePromptTemplates();

  const { contains } = useFilter({ sensitivity: "base" });

  // Advertir al usuario si intenta salir durante la ejecución
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isExecuting) {
        e.preventDefault();
        e.returnValue = "The experiment is still running. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isExecuting]);

  // Create collection with dynamic items
  const collection = useMemo(() => 
    createListCollection({
      items: configuredModels.map((model) => ({
        label: model.short_name,
        value: String(model.id),
      })),
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    }),
    [configuredModels]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const dto: CreateExperimentDto = {
      name,
      prompt_template: Number(promptTemplateId),
      configured_models: selectedModelIds.map(Number),
      num_runs: Number(numRuns),
    };

    console.log("Submitting experiment:", dto);

    setIsExecuting(true);
    try {
      await apiProvider.post({
        path: "/experiments/",
        body: dto,
      });

      toaster.create({
        title: "Experiment created",
        description: "The experiment has been successfully created.",
        type: "success",
        duration: 3000,
      });

      router.push("/experiments");
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error creating experiment",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error creating experiment",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error creating experiment:", error);
    } finally {
      setIsExecuting(false);
    }
  };

  /// 3) selectedItems para los chips
  const selectedItems = collection.items.filter((it) =>
    selectedModelIds.includes(it.value),
  );


  return (
    <Card.Root
      asChild
      maxW="5xl"
      mt={8}
      variant="elevated"
    >
      <form onSubmit={handleSubmit}>
        <Card.Header>
          <Card.Title fontSize="2xl">Create New Experiment</Card.Title>
          <Card.Description mt={2} color="fg.muted">
            Please complete the following information to create a new experiment.
          </Card.Description>
        </Card.Header>
        
        <Card.Body>
          <Stack gap={8}>
            {/* Fieldset: detalles del experimento */}
            <Fieldset.Root size="lg" colorPalette="teal">
              <Stack gap={4}>
                <Fieldset.Legend fontSize="lg" fontWeight="semibold">Experiment Details</Fieldset.Legend>
                <Fieldset.HelperText color="fg.muted">
                  Name, configurated models and prompt template.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content mt={6}>
                <Field.Root>
                  <Field.Label fontWeight="medium">Name</Field.Label>
                  <Input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter experiment name"
                    size="md"
                    required
                  />
                </Field.Root>

                <Field.Root>
                  <Field.Label fontWeight="medium">Configurated Models</Field.Label>
                  <Field.HelperText mt={1} mb={3}>
                    Select the configurated models for the experiment
                  </Field.HelperText>

                  {/* chips con los modelos seleccionados */}
                  {selectedItems.length > 0 && (
                    <Stack gap={3} mb={3}>
                      {selectedItems.map((item) => {
                        const model = configuredModels.find(m => String(m.id) === item.value);
                        return (
                          <Card.Root 
                            key={item.value} 
                            size="sm" 
                            variant="subtle"
                            borderWidth="1px"
                            borderColor="teal.500/20"
                          >
                            <Card.Body py={3}>
                              <Flex justify="space-between" align="center" gap={4}>
                                <Stack gap={1} flex="1">
                                  <Text fontWeight="semibold" fontSize="sm">
                                    {item.label}
                                  </Text>
                                  {model && (
                                    <Text fontSize="xs" color="fg.muted">
                                      {model.llm_name}
                                    </Text>
                                  )}
                                </Stack>
                                <Flex gap={3} align="center">
                                  {model && (
                                    <>
                                      <Stack gap={0} align="flex-end">
                                        <Text fontSize="xs" color="fg.muted">Temperature</Text>
                                        <Badge colorPalette="blue" variant="subtle" size="sm">
                                          {model.temperature}
                                        </Badge>
                                      </Stack>
                                      {model.topP !== null && (
                                        <Stack gap={0} align="flex-end">
                                          <Text fontSize="xs" color="fg.muted">Top P</Text>
                                          <Badge colorPalette="purple" variant="subtle" size="sm">
                                            {model.topP}
                                          </Badge>
                                        </Stack>
                                      )}
                                    </>
                                  )}
                                  <IconButton
                                    aria-label="Remove model"
                                    size="sm"
                                    variant="ghost"
                                    colorPalette="red"
                                    onClick={() => {
                                      setSelectedModelIds(prev => prev.filter(id => id !== item.value));
                                    }}
                                  >
                                    <LuX />
                                  </IconButton>
                                </Flex>
                              </Flex>
                            </Card.Body>
                          </Card.Root>
                        );
                      })}
                    </Stack>
                  )}

                  <Combobox.Root
                    multiple
                    collection={collection}
                    value={selectedModelIds}
                    onValueChange={(details) => {
                      setSelectedModelIds(details.value);
                    }}
                    openOnClick
                    size="md"
                    placeholder={
                      loadingModels
                        ? "Loading models..."
                        : configuredModels.length === 0
                        ? "No configurated models available"
                        : "Select configurated models"
                    }
                    disabled={loadingModels || configuredModels.length === 0}
                  >
                    <Combobox.Control>
                      <Combobox.Input />
                      <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger />
                        <Combobox.Trigger />
                      </Combobox.IndicatorGroup>
                    </Combobox.Control>

                    <Combobox.Positioner>
                      <Combobox.Content>
                        {collection.items.map((item) => (
                          <Combobox.Item key={item.value} item={item}>
                            {item.label}
                          </Combobox.Item>
                        ))}
                      </Combobox.Content>
                    </Combobox.Positioner>
                  </Combobox.Root>
                </Field.Root>

                {/* Prompt template */}
                <Field.Root>
                  <Field.Label fontWeight="medium">Prompt Template</Field.Label>
                  <NativeSelect.Root disabled={loadingPrompts} size="md">
                    <NativeSelect.Field
                      name="prompt_template"
                      value={promptTemplateId === "" ? "" : String(promptTemplateId)}
                      onChange={(e) =>
                        setPromptTemplateId(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    >
                      <option value="">Select prompt template</option>
                      {templates.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>

                  {/* Información del prompt template seleccionado */}
                  {promptTemplateId !== "" && (() => {
                    const selectedTemplate = templates.find(t => t.id === Number(promptTemplateId));
                    if (!selectedTemplate) return null;
                    
                    return (
                      <Card.Root 
                        size="sm" 
                        variant="subtle"
                        borderWidth="1px"
                        borderColor="teal.500/20"
                        mt={3}
                      >
                        <Card.Body py={3}>
                          <Stack gap={3}>
                            <Flex justify="space-between" align="center">
                              <Text fontWeight="semibold" fontSize="sm">
                                {selectedTemplate.name}
                              </Text>
                              {selectedTemplate.user_prompt.k && (
                                <Badge colorPalette="teal" variant="subtle" size="sm">
                                  k = {selectedTemplate.user_prompt.k}
                                </Badge>
                              )}
                            </Flex>
                            
                            <Stack gap={2}>
                              <Stack gap={1}>
                                <Text fontSize="xs" fontWeight="medium" color="fg.muted">
                                  System Prompt:
                                </Text>
                                <Text 
                                  fontSize="xs" 
                                  color="fg" 
                                  bg="bg.muted" 
                                  p={2} 
                                  rounded="md"
                                  maxH="100px"
                                  overflowY="auto"
                                  whiteSpace="pre-wrap"
                                  css={{
                                    '&::-webkit-scrollbar': {
                                      width: '8px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                      background: 'var(--chakra-colors-border)',
                                      borderRadius: '4px',
                                    },
                                  }}
                                >
                                  {selectedTemplate.system_prompt.text}
                                </Text>
                              </Stack>

                              <Stack gap={1}>
                                <Text fontSize="xs" fontWeight="medium" color="fg.muted">
                                  User Prompt:
                                </Text>
                                <Text 
                                  fontSize="xs" 
                                  color="fg" 
                                  bg="bg.muted" 
                                  p={2} 
                                  rounded="md"
                                  maxH="100px"
                                  overflowY="auto"
                                  whiteSpace="pre-wrap"
                                  css={{
                                    '&::-webkit-scrollbar': {
                                      width: '8px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                      background: 'var(--chakra-colors-border)',
                                      borderRadius: '4px',
                                    },
                                  }}
                                >
                                  {selectedTemplate.user_prompt.text}
                                </Text>
                              </Stack>

                              {selectedTemplate.user_prompt.features && selectedTemplate.user_prompt.features.length > 0 && (
                                <Stack gap={1}>
                                  <Text fontSize="xs" fontWeight="medium" color="fg.muted">
                                    Features ({selectedTemplate.user_prompt.features.length}):
                                  </Text>
                                  <Flex gap={2} flexWrap="wrap">
                                    {selectedTemplate.user_prompt.features.map((feature) => (
                                      <Badge 
                                        key={feature.id} 
                                        colorPalette="purple" 
                                        variant="subtle" 
                                        size="sm"
                                        title={feature.description}
                                      >
                                        {feature.name}
                                      </Badge>
                                    ))}
                                  </Flex>
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                        </Card.Body>
                      </Card.Root>
                    );
                  })()}
                </Field.Root>
              </Fieldset.Content>
            </Fieldset.Root>

            {/* Fieldset: parámetros */}
            <Fieldset.Root size="lg" colorPalette="teal">
              <Stack gap={4}>
                <Fieldset.Legend fontSize="lg" fontWeight="semibold">Parameters</Fieldset.Legend>
                <Fieldset.HelperText color="fg.muted">
                  Configure the number of runs for this experiment.
                </Fieldset.HelperText>
              </Stack>

              <Fieldset.Content mt={6}>
                <Field.Root>
                  <Field.Label fontWeight="medium">Number of Runs</Field.Label>
                  <Field.HelperText mt={1} mb={2}>
                    Set a value between 1 and 100
                  </Field.HelperText>
                  <NumberInput.Root
                    min={1}
                    max={100}
                    value={numRuns}
                    size="md"
                    onValueChange={(details) => setNumRuns(details.value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input name="num_runs" />
                  </NumberInput.Root>
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
            onClick={() => router.push("/experiments")}
            disabled={isExecuting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            colorPalette="teal"
            size="lg"
            loading={isExecuting}
            loadingText="Creating experiment..."
          >
            Create Experiment
          </Button>
        </Card.Footer>
      </form>
    </Card.Root>
  );
};
