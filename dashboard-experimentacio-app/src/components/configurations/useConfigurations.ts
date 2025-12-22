"use client";

import useSWR from "swr";
import apiProvider from "@/providers/api";
import { Configuration } from "@/model/configuration";

export function useConfigurations() {
  const { data, error, isLoading, mutate } = useSWR<Configuration[]>(
    "/configurations/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteConfiguration = async (id: number) => {
    // petición DELETE al endpoint concreto
    await apiProvider.delete<void>(`/configurations/${id}/`);

    // revalidar la lista desde el servidor
    await mutate();

  };

  return {
    configurations: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteConfiguration,
  };
}


