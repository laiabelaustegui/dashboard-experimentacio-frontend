"use client";

import { useState } from "react";
import { Flex, Tabs } from "@chakra-ui/react";
import { LlmsTable } from "@/components/llms/LlmsTable";
import { ConfiguredModelsTable } from "@/components/configured-models/ConfiguredModelsTable";
import { ConfigurationsTable } from "@/components/configurations/ConfigurationsTable";
import { CreateNewButton } from "@/components/ui/button";

export const LlmsTabs = () => {
  const [tab, setTab] = useState<"configured" | "base" | "configs">("configured");

  const { href, label } =
    tab === "configured"
      ? { href: "/llms/new-configured", label: "Add configured model" }
      : tab === "base"
      ? { href: "/llms/new", label: "Add model" }
      : { href: "/llms/configurations/new", label: "Add configuration" };

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

        <CreateNewButton href={href} label={label} />
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
