"use client";

import { useState } from "react";
import {
  Button,
  Dialog,
  Input,
  Stack,
  Field,
  NativeSelect,
  Portal,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import apiProvider, { ApiError } from "@/providers/api";
import type { CreateConfiguredModelDto } from "@/models/configuredModel";
import type { Configuration } from "@/models/configuration";
import type { LLM } from "@/models/LLM";
import { toaster } from "@/components/ui/toaster";

interface CreateConfiguredModelModalProps {
  onSuccess?: () => void;
  configurations: Configuration[];
  llms: LLM[];
}

export const CreateConfiguredModelModal = ({
  onSuccess,
  configurations,
  llms,
}: CreateConfiguredModelModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    short_name: "",
    configuration: "",
    llm: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.short_name.trim()) {
      toaster.create({
        title: "Validation Error",
        description: "Please provide a name for the configured model.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.configuration) {
      toaster.create({
        title: "Validation Error",
        description: "Please select a configuration.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    if (!formData.llm) {
      toaster.create({
        title: "Validation Error",
        description: "Please select a base model.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const dto: CreateConfiguredModelDto = {
        short_name: formData.short_name.trim(),
        configuration: parseInt(formData.configuration),
        llm: parseInt(formData.llm),
      };

      await apiProvider.post<void, CreateConfiguredModelDto>({
        path: "/configured-models/",
        body: dto,
      });

      toaster.create({
        title: "Configured model created",
        description: "The configured model has been successfully created.",
        type: "success",
        duration: 3000,
      });

      // Reset form
      setFormData({ short_name: "", configuration: "", llm: "" });
      setOpen(false);

      // Callback to reload data
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error creating configured model",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error creating configured model",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error creating configured model:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="teal">
          <LuPlus />
          New Configured Model
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <form onSubmit={handleSubmit}>
              <Dialog.Header>
                <Dialog.Title>Create Configured Model</Dialog.Title>
              </Dialog.Header>

              <Dialog.Body>
                <Stack gap={4}>
                  <Field.Root required>
                    <Field.Label>Name</Field.Label>
                    <Input
                      placeholder="e.g., GPT-4 Creative"
                      value={formData.short_name}
                      onChange={(e) =>
                        setFormData({ ...formData, short_name: e.target.value })
                      }
                      required
                    />
                    <Field.HelperText>
                      A descriptive name for this configured model
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Configuration</Field.Label>
                    <NativeSelect.Root disabled={isSubmitting}>
                      <NativeSelect.Field
                        placeholder="Select a configuration"
                        value={formData.configuration}
                        onChange={(e) =>
                          setFormData({ ...formData, configuration: e.target.value })
                        }
                      >
                        {configurations.map((config) => (
                          <option key={config.id} value={config.id}>
                            {config.name} (temp: {config.temperature}, topP:{" "}
                            {config.topP ?? "N/A"})
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.HelperText>
                      The configuration to use for this model
                    </Field.HelperText>
                  </Field.Root>

                  <Field.Root required>
                    <Field.Label>Base Model</Field.Label>
                    <NativeSelect.Root disabled={isSubmitting}>
                      <NativeSelect.Field
                        placeholder="Select a base model"
                        value={formData.llm}
                        onChange={(e) =>
                          setFormData({ ...formData, llm: e.target.value })
                        }
                      >
                        {llms.map((llm) => (
                          <option key={llm.id} value={llm.id}>
                            {llm.name} ({llm.provider})
                          </option>
                        ))}
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.HelperText>
                      The base LLM to use for this configured model
                    </Field.HelperText>
                  </Field.Root>
                </Stack>
              </Dialog.Body>

              <Dialog.Footer>
                <Dialog.CloseTrigger asChild>
                  <Button variant="outline">Cancel</Button>
                </Dialog.CloseTrigger>
                <Button type="submit" colorPalette="teal" loading={isSubmitting}>
                  Create
                </Button>
              </Dialog.Footer>
            </form>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};