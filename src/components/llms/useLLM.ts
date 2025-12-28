"use client";

import useSWR from "swr";
import type { LLM } from "@/models/LLM";
import apiProvider from "@/providers/api";

export function useLLMs() {
  const { data, error, isLoading, mutate } = useSWR<LLM[]>(
    "/llms/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteLLM = async (id: number) => {
    // petición DELETE al endpoint concreto
    await apiProvider.delete<void>(`/llms/${id}/`);

    // revalidar la lista desde el servidor
    await mutate();

  };

  return {
    llms: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteLLM,
  };
}


