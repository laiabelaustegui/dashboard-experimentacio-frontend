"use client";

import useSWR from "swr";
import type { ConfiguredModel } from "@/models/configuredModel";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

export function useConfiguredModels() {
  const { data, error, isLoading, mutate } = useSWR<ConfiguredModel[]>(
    "/configured-models/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteConfiguredModel = async (id: number) => {
    try {
      // petición DELETE al endpoint concreto
      await apiProvider.delete<void>(`/configured-models/${id}/`);

      // revalidar la lista desde el servidor
      await mutate();
      
      toaster.create({
        title: "Configured model deleted",
        description: "The configured model has been successfully deleted.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error deleting configured model",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error deleting configured model",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error deleting configured model:", error);
    }

  };

  return {
    configuredModels: data 
      ? [...data].sort((a, b) => b.id - a.id)
      : [],
    isLoading,
    isError: !!error,
    error,
    deleteConfiguredModel,
    mutate,
  };
}


