"use client";

import useSWR from "swr";
import type { ConfiguredModel } from "@/model/configuredModel";
import apiProvider from "@/providers/api";

export function useConfiguredModels() {
  const { data, error, isLoading, mutate } = useSWR<ConfiguredModel[]>(
    "/configured-models/" // se resuelve contra tu BASE_URL en apiProvider
  )

  const deleteConfiguredModel = async (id: number) => {
    // petición DELETE al endpoint concreto
    await apiProvider.delete<void>(`/configured-models/${id}/`);

    // revalidar la lista desde el servidor
    await mutate();

  };

  return {
    configuredModels: data ?? [],
    isLoading,
    isError: !!error,
    error,
    deleteConfiguredModel,
  };
}


