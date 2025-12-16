"use client";

import { Tabs } from "@chakra-ui/react";
import { LlmsTable } from "@/components/llms/LlmsTable";
import { ConfiguredModelsTable } from "@/components/configured-models/ConfiguredModelsTable";
import { ConfigurationsTable } from "@/components/configurations/ConfigurationsTable";

export const LlmsTabs = () => {
  return (
    <Tabs.Root variant="enclosed" colorPalette="teal">
      <Tabs.List>
        <Tabs.Trigger value="configured">Configured models</Tabs.Trigger>
        <Tabs.Trigger value="base">Base models</Tabs.Trigger>
        <Tabs.Trigger value="configs">Configurations</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>

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
