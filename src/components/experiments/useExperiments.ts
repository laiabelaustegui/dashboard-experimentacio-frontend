"use client";

import useSWR from "swr";
import type { Experiment } from "@/models/experiment";
import apiProvider, { ApiError } from "@/providers/api";
import { toaster } from "@/components/ui/toaster";

export function useExperiments() {
  const { data, error, isLoading, mutate } = useSWR<Experiment[]>(
    "/experiments/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteExperiment = async (id: number) => {
    try {
      // petición DELETE al endpoint concreto
      await apiProvider.delete<void>(`/experiments/${id}/`);

      // revalidar la lista desde el servidor
      await mutate();
      
      toaster.create({
        title: "Experiment deleted",
        description: "The experiment has been successfully deleted.",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toaster.create({
          title: "Error deleting experiment",
          description: error.message,
          type: "error",
          duration: 5000,
        });
      } else {
        toaster.create({
          title: "Error deleting experiment",
          description: "An unexpected error occurred. Please try again.",
          type: "error",
          duration: 5000,
        });
      }
      console.error("Error deleting experiment:", error);
    }

  };

  return {
    experiments: data 
      ? [...data].sort((a, b) => new Date(b.execution_date).getTime() - new Date(a.execution_date).getTime())
      : [],
    isLoading,
    isError: !!error,
    error,
    deleteExperiment,
  };
}


