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
  Input,
  NativeSelect,
  NumberInput,
  Stack,
  Text,
  useFilter,
  createListCollection,
} from "@chakra-ui/react";
import { useState, FormEvent, useMemo } from "react";
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

  const { configuredModels, isLoading: loadingModels } = useConfiguredModels();
  const { templates, isLoading: loadingPrompts } = usePromptTemplates();

  const { contains } = useFilter({ sensitivity: "base" });

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
      mt={4}
    >
      <form onSubmit={handleSubmit}>
        <Card.Body>
          <Text mb={6} color="fg.muted">
            Please complete the following information to create a new experiment.
          </Text>

      <Flex direction={{ base: "column", md: "row" }} gap={8} align="flex-start">
        {/* Fieldset: detalles del experimento */}
        <Fieldset.Root size="lg" flex="1" colorPalette="teal">
          <Stack mb={4}>
            <Fieldset.Legend>Experiment details</Fieldset.Legend>
            <Fieldset.HelperText>
              Name, configurated models and prompt template.
            </Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            {/* Name */}
            <Field.Root>
              <Field.Label>Name</Field.Label>
              <Input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Experiment name"
                required
              />
            </Field.Root>

            {/* Models (Combobox multiple) */}
            <Field.Root mt={4}>
              <Field.Label>Configurated Models</Field.Label>
              <Field.HelperText>
                Select the configurated models for the experiment
              </Field.HelperText>

              {/* chips con los modelos seleccionados */}
              {selectedItems.length > 0 && (
                <Stack direction="row" flexWrap="wrap" gap={2} mt={2} mb={2}>
                  {selectedItems.map((item) => (
                    <Badge
                      key={item.value}
                      colorPalette="teal"
                      px={2}
                      py={1}
                      rounded="md"
                    >
                      {item.label}
                    </Badge>
                  ))}
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
            <Field.Root mt={4}>
              <Field.Label>Prompt template</Field.Label>
              <NativeSelect.Root disabled={loadingPrompts}>
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
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>

        {/* Fieldset: parámetros */}
        <Fieldset.Root size="lg" flex="1" colorPalette="teal">
          <Stack mb={4}>
            <Fieldset.Legend>Parameters</Fieldset.Legend>
            <Fieldset.HelperText>Configure number of runs.</Fieldset.HelperText>
          </Stack>

          <Fieldset.Content>
            <Field.Root mt={4}>
              <Field.Label>Number of runs</Field.Label>
              <NumberInput.Root
                min={1}
                max={100}
                value={numRuns}
                onValueChange={(details) => setNumRuns(details.value)}
              >
                <NumberInput.Control />
                <NumberInput.Input name="num_runs" />
              </NumberInput.Root>
            </Field.Root>
          </Fieldset.Content>
        </Fieldset.Root>
      </Flex>

      <Flex justify="flex-end" mt={8} gap={3}>
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" colorPalette="teal">
          Execute
        </Button>
      </Flex>
        </Card.Body>
      </form>
    </Card.Root>
  );
};
