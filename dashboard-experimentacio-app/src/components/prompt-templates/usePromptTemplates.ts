"use client";

import useSWR from "swr";
import type { PromptTemplate } from "@/model/promptTemplate";
import apiProvider from "@/providers/api";

export function usePromptTemplates() {
  const { data, error, isLoading, mutate } = useSWR<PromptTemplate[]>(
    "/prompt-templates/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteTemplate = async (id: number) => {
    // petición DELETE al endpoint concreto
    await apiProvider.delete<void>(`/prompt-templates/${id}/`);

    // revalidar la lista desde el servidor
    await mutate();

  };

  return {
    templates: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteTemplate,
  };
}


