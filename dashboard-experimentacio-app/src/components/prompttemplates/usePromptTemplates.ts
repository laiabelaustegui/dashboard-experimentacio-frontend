"use client";

import useSWR from "swr";
import type { PromptTemplate } from "@/model/promptTemplate";

export function usePromptTemplates() {
  const { data, error, isLoading } = useSWR<PromptTemplate[]>(
    "/prompt-templates/" // se resuelve contra tu BASE_URL en apiProvider
  );

  return {
    templates: data ?? [],
    isLoading,
    isError: !!error,
    error,
  };
}


