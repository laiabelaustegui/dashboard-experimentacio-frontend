"use client";

import useSWR from "swr";
import type { PromptTemplate } from "@/model/promptTemplate";

export function usePromptTemplates() {
  const { data, error, isLoading } = useSWR<PromptTemplate[]>(
    "/prompttemplates/" // se resuelve contra tu BASE_URL en apiProvider
  );

  return {
    templates: data ?? [],
    isLoading,
    isError: !!error,
    error,
  };
}


