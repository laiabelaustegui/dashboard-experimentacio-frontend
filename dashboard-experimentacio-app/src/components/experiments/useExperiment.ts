"use client";

import useSWR from "swr";
import { Experiment } from "@/model/experiment";

export function useExperiment(id: number) {
  const { data, error, isLoading } = useSWR<Experiment>(
    `/experiments/${id}/` // se resuelve contra tu BASE_URL en apiProvider
  )
    return {
    experiment: data,
    isLoading,
    isError: !!error,
    error,
  };
}


