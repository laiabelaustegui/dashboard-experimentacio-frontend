"use client";

import { useState } from "react";
import { Flex, Tabs } from "@chakra-ui/react";
import { LlmsTable } from "@/components/llms/LlmsTable";
import { ConfiguredModelsTable } from "@/components/configured-models/ConfiguredModelsTable";
import { ConfigurationsTable } from "@/components/configurations/ConfigurationsTable";
import { CreateConfigurationModal } from "@/components/configurations/CreateConfigurationModal";
import { CreateConfiguredModelModal } from "@/components/configured-models/CreateConfiguredModelModal";
import { useConfigurations } from "@/components/configurations/useConfigurations";
import { useLLMs } from "@/components/llms/useLLM";
import { Button } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";

export const LlmsTabs = () => {
  const [tab, setTab] = useState<"configured" | "base" | "configs">("configured");
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { configurations } = useConfigurations();
  const { llms } = useLLMs();

  const handleConfigurationSuccess = () => {
    // Revalidar la lista de configuraciones
    mutate("/configurations/");
  };

  const handleConfiguredModelSuccess = () => {
    // Revalidar la lista de configured models
    mutate("/configured-models/");
  };

  return (
    <Tabs.Root
      value={tab}
      onValueChange={({ value }) => setTab(value as typeof tab)}
      variant="enclosed"
      colorPalette="teal"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Tabs.List>
          <Tabs.Trigger value="configured">Configured models</Tabs.Trigger>
          <Tabs.Trigger value="base">Base models</Tabs.Trigger>
          <Tabs.Trigger value="configs">Configurations</Tabs.Trigger>
          <Tabs.Indicator />
        </Tabs.List>

        {tab === "configured" && (
          <CreateConfiguredModelModal
            onSuccess={handleConfiguredModelSuccess}
            configurations={configurations || []}
            llms={llms || []}
          />
        )}
        {tab === "base" && (
          <Button 
            colorPalette="teal"
            onClick={() => router.push("/llms/new")}
          >
            <LuPlus /> Add model
          </Button>
        )}
        {tab === "configs" && (
          <CreateConfigurationModal onSuccess={handleConfigurationSuccess} />
        )}
      </Flex>

      <Tabs.Content value="configured">
        <ConfiguredModelsTable />
      </Tabs.Content>
      <Tabs.Content value="base">
        <LlmsTable />
      </Tabs.Content>
      <Tabs.Content value="configs">
        <ConfigurationsTable />
      </Tabs.Content>
    </Tabs.Root>
  );
};
