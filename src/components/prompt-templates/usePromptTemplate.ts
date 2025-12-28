"use client";

import useSWR from "swr";
import type { PromptTemplate } from "@/models/promptTemplate";


export function usePromptTemplate(id: number) {
  const { data, error, isLoading } = useSWR<PromptTemplate>(
    `/prompt-templates/${id}/` // se resuelve contra tu BASE_URL en apiProvider
  )
    return {
    template: data,
    isLoading,
    isError: !!error,
    error,
  };
}


