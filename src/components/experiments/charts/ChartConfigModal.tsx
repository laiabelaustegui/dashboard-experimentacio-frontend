"use client";

import {
  Button,
  Dialog,
  Flex,
  Portal,
  Select,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

type ChartType = "heatmap" | "line";
type HeatmapType = "frequency" | "score";
type SelectionMode = "runs" | "feature";

interface ChartConfigModalProps {
  open: boolean;
  onClose: () => void;
  experimentId: number;
  runs: any[];
}

export default function ChartConfigModal({
  open,
  onClose,
  experimentId,
  runs,
}: ChartConfigModalProps) {
  const router = useRouter();
  const [chartType, setChartType] = useState<ChartType>("heatmap");
  const [heatmapType, setHeatmapType] = useState<HeatmapType>("frequency");
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("runs");
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string>("");

  const chartTypeCollection = createListCollection({
    items: [
      { value: "heatmap", label: "Heatmap" },
      { value: "line", label: "Line Chart" },
    ],
  });

  const heatmapTypeCollection = createListCollection({
    items: [
      { value: "frequency", label: "Frequency Heatmap" },
      { value: "score", label: "Score Heatmap" },
    ],
  });

  const selectionModeCollection = createListCollection({
    items: [
      { value: "runs", label: "Select by Runs" },
      { value: "feature", label: "Select by Feature" },
    ],
  });

  // Get unique features from runs
  const uniqueFeatures = useMemo(() => {
    const features = Array.from(
      new Set(runs.map((run) => run.feature.name))
    ).sort();
    return features;
  }, [runs]);

  const featuresCollection = createListCollection({
    items: uniqueFeatures.map(name => ({ value: name, label: name })),
  });

  const runsCollection = createListCollection({
    items: runs,
    itemToString: (run) => `Run #${runs.findIndex((r) => r.id === run.id) + 1} (id: ${run.id})`,
    itemToValue: (run) => String(run.id),
  });

  const handleGenerate = () => {
    let runsToUse = selectedRuns;

    // If feature mode, get all runs with the selected feature
    if (selectionMode === "feature" && selectedFeature) {
      runsToUse = runs
        .filter((run) => run.feature.name === selectedFeature)
        .map((run) => String(run.id));
    }

    // Build query params for the chart page
    const params = new URLSearchParams({
      experimentId: String(experimentId),
      chartType,
      runs: runsToUse.join(","),
    });

    // Add heatmap type if heatmap is selected
    if (chartType === "heatmap") {
      params.append("heatmapType", heatmapType);
    }

    // Navigate to the chart page
    router.push(`/experiments/${experimentId}/chart?${params.toString()}`);
    onClose();
  };

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && onClose()} size="lg" placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Configure Chart</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger />

            <Dialog.Body>
              <Flex direction="column" gap={4}>
            {/* Chart Type Selection */}
            <Flex direction="column" gap={2}>
              <Text fontWeight="medium">Chart Type</Text>
              <Select.Root
                collection={chartTypeCollection}
                value={[chartType]}
                onValueChange={(details) => {
                  setChartType(details.value[0] as ChartType);
                }}
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select chart type" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content>
                    {chartTypeCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Flex>

            {/* Heatmap Type Selection - shown only when heatmap is selected */}
            {chartType === "heatmap" && (
              <Flex direction="column" gap={2}>
                <Text fontWeight="medium">Heatmap Type</Text>
                <Select.Root
                  collection={heatmapTypeCollection}
                  value={[heatmapType]}
                  onValueChange={(details) => {
                    setHeatmapType(details.value[0] as HeatmapType);
                  }}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select heatmap type" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>

                  <Select.Positioner>
                    <Select.Content>
                      {heatmapTypeCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
                <Text textStyle="xs" color="fg.muted">
                  {heatmapType === "frequency" 
                    ? "Shows how often each app appears at each ranking position" 
                    : "Shows actual score values for each app"}
                </Text>
              </Flex>
            )}

            {/* Selection Mode - shown only for frequency heatmap */}
            {chartType === "heatmap" && heatmapType === "frequency" && (
              <Flex direction="column" gap={2}>
                <Text fontWeight="medium">Selection Mode</Text>
                <Select.Root
                  collection={selectionModeCollection}
                  value={[selectionMode]}
                  onValueChange={(details) => {
                    setSelectionMode(details.value[0] as SelectionMode);
                    // Reset selections when changing mode
                    setSelectedRuns([]);
                    setSelectedFeature("");
                  }}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select mode" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>

                  <Select.Positioner>
                    <Select.Content>
                      {selectionModeCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Flex>
            )}

            {/* Feature Selection - shown when selection mode is feature */}
            {chartType === "heatmap" && heatmapType === "frequency" && selectionMode === "feature" && (
              <Flex direction="column" gap={2}>
                <Text fontWeight="medium">Select Feature</Text>
                <Text textStyle="sm" color="fg.muted">
                  All runs with this feature will be included
                </Text>
                <Select.Root
                  collection={featuresCollection}
                  value={selectedFeature ? [selectedFeature] : []}
                  onValueChange={(details) => {
                    setSelectedFeature(details.value[0] || "");
                  }}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select feature" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                      <Select.ClearTrigger />
                    </Select.IndicatorGroup>
                  </Select.Control>

                  <Select.Positioner>
                    <Select.Content>
                      {featuresCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
              </Flex>
            )}

            {/* Runs Selection - shown when not using feature mode or for other chart types */}
            {!(chartType === "heatmap" && heatmapType === "frequency" && selectionMode === "feature") && (
            <Flex direction="column" gap={2}>
              <Flex justify="space-between" align="center">
                <Text fontWeight="medium">Select Runs</Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    const allRunIds = runs.map((run) => String(run.id));
                    setSelectedRuns(allRunIds);
                  }}
                >
                  Select All
                </Button>
              </Flex>
              <Text textStyle="sm" color="fg.muted">
                Choose one or more runs to include in the chart
              </Text>
              <Select.Root
                collection={runsCollection}
                value={selectedRuns}
                onValueChange={(details) => {
                  setSelectedRuns(details.value);
                }}
                multiple
                size="sm"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder="Select runs" />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                    <Select.ClearTrigger />
                  </Select.IndicatorGroup>
                </Select.Control>

                <Select.Positioner>
                  <Select.Content>
                    {runsCollection.items.map((run) => (
                      <Select.Item key={run.id} item={run}>
                        Run #{runs.findIndex((r) => r.id === run.id) + 1} (id: {run.id})
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Select.Root>
            </Flex>
            )}

            {/* Additional information based on chart type */}
            {chartType === "line" && (
              <Text textStyle="sm" color="fg.muted" fontStyle="italic">
                Line chart will show the number of distinct apps per ranking position, grouped by configured model
              </Text>
            )}
          </Flex>
        </Dialog.Body>

        <Dialog.Footer>
          <Dialog.ActionTrigger asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </Dialog.ActionTrigger>
          <Button
            colorPalette="teal"
            onClick={handleGenerate}
            disabled={
              (selectionMode === "runs" && selectedRuns.length === 0) ||
              (selectionMode === "feature" && !selectedFeature)
            }
          >
            Generate Chart
          </Button>
        </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
