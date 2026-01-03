"use client";

import useSWR from "swr";
import type { LLM } from "@/models/LLM";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

export function useLLMs() {
  const { data, error, isLoading, mutate } = useSWR<LLM[]>(
    "/llms/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteLLM = async (id: number) => {
    try {
      // petición DELETE al endpoint concreto
      await apiProvider.delete<void>(`/llms/${id}/`);

      // revalidar la lista desde el servidor
      await mutate();
      
      toaster.create({
        title: "LLM deleted",
        description: "The LLM has been successfully deleted.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error deleting LLM",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error deleting LLM",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error deleting LLM:", error);
    }

  };

  return {
    llms: data 
      ? [...data].sort((a, b) => new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime())
      : [],
    isLoading,
    isError: !!error,
    error,
    deleteLLM,
  };
}


