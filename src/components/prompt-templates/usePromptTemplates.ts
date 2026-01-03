"use client";

import useSWR from "swr";
import type { PromptTemplate } from "@/models/promptTemplate";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

export function usePromptTemplates() {
  const { data, error, isLoading, mutate } = useSWR<PromptTemplate[]>(
    "/prompt-templates/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteTemplate = async (id: number) => {
    try {
      // petición DELETE al endpoint concreto
      await apiProvider.delete<void>(`/prompt-templates/${id}/`);

      // revalidar la lista desde el servidor
      await mutate();
      
      // Mostrar mensaje de éxito
      toaster.create({
        title: "Template deleted",
        description: "The prompt template and all associated experiments have been successfully deleted.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      // Manejar el error y mostrar notificación
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error deleting template",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error deleting template",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error deleting template:", error);
    }

  };

  const getTemplate = (id: number): PromptTemplate | undefined => {
    return data?.find((template) => template.id === id);
  };

  return {
    templates: data 
      ? [...data].sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
      : [],
    isLoading,
    isError: !!error,
    error,
    deleteTemplate,
    getTemplate,
  };
}


