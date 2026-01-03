"use client";

import useSWR from "swr";
import apiProvider, { ApiError } from "@/providers/api";
import { Configuration } from "@/models/configuration";
import { toaster } from "@/components/ui/toaster";

export function useConfigurations() {
  const { data, error, isLoading, mutate } = useSWR<Configuration[]>(
    "/configurations/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteConfiguration = async (id: number) => {
    try {
      // petición DELETE al endpoint concreto
      await apiProvider.delete<void>(`/configurations/${id}/`);

      // revalidar la lista desde el servidor
      await mutate();
      
      toaster.create({
        title: "Configuration deleted",
        description: "The configuration has been successfully deleted.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error deleting configuration",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error deleting configuration",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error deleting configuration:", error);
    }

  };

  return {
    configurations: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteConfiguration,
  };
}


