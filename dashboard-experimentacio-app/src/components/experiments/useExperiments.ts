"use client";

import useSWR from "swr";
import type { Experiment } from "@/model/experiment";
import apiProvider from "@/providers/api";

export function useExperiments() {
  const { data, error, isLoading, mutate } = useSWR<Experiment[]>(
    "/experiments/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteExperiment = async (id: number) => {
    // petición DELETE al endpoint concreto
    await apiProvider.delete<void>(`/experiments/${id}/`);

    // revalidar la lista desde el servidor
    await mutate();

  };

  return {
    experiments: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteExperiment,
  };
}


