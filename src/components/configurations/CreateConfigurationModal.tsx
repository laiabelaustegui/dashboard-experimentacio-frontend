"use client";

import { useState, FormEvent } from "react";
import {
  Button,
  Dialog,
  Field,
  Input,
  NumberInput,
  Stack,
} from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

interface CreateConfigurationModalProps {
  onSuccess?: () => void;
}

export const CreateConfigurationModal = ({ onSuccess }: CreateConfigurationModalProps) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [temperature, setTemperature] = useState("0.7");
  const [topP, setTopP] = useState("1.0");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiProvider.post({
        path: "/configurations/",
        body: {
          name,
          temperature: parseFloat(temperature),
          topP: parseFloat(topP),
        },
      });

      toaster.create({
        title: "Configuration created",
        description: "The configuration has been successfully created.",
        type: "success",
        duration: 3000,
      });

      // Reset form
      setName("");
      setTemperature("0.7");
      setTopP("1.0");
      setOpen(false);

      // Callback para recargar datos
      onSuccess?.();
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error creating configuration",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error creating configuration",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error creating configuration:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Dialog.Trigger asChild>
        <Button colorPalette="teal">
          <LuPlus /> New Configuration
        </Button>
      </Dialog.Trigger>

      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <form onSubmit={handleSubmit}>
            <Dialog.Header>
              <Dialog.Title>Create New Configuration</Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Stack gap={4}>
                <Field.Root required>
                  <Field.Label>Name</Field.Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., High Temperature"
                    required
                  />
                  <Field.HelperText>
                    A descriptive name for this configuration
                  </Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Temperature</Field.Label>
                  <NumberInput.Root
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onValueChange={(details) => setTemperature(details.value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                  <Field.HelperText>
                    Controls randomness (0 = deterministic, 1 = very random)
                  </Field.HelperText>
                </Field.Root>

                <Field.Root required>
                  <Field.Label>Top P</Field.Label>
                  <NumberInput.Root
                    min={0}
                    max={1}
                    step={0.1}
                    value={topP}
                    onValueChange={(details) => setTopP(details.value)}
                  >
                    <NumberInput.Control />
                    <NumberInput.Input />
                  </NumberInput.Root>
                  <Field.HelperText>
                    Nucleus sampling (0.1 = only top 10% tokens considered). Default value is 1.
                  </Field.HelperText>
                </Field.Root>
              </Stack>
            </Dialog.Body>

            <Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.CloseTrigger>
              <Button 
                type="submit" 
                colorPalette="teal"
                loading={isSubmitting}
              >
                Create
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
