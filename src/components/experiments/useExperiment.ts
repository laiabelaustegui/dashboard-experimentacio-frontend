"use client";

import useSWR from "swr";
import { Experiment } from "@/models/experiment";

export function useExperiment(id: number) {
  const { data, error, isLoading } = useSWR<Experiment>(
    `/experiments/${id}/` 
  )
    return {
    experiment: data,
    isLoading,
    isError: !!error,
    error,
  };
}


