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
type HeatmapType = "frequency" | "jaccard";
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
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("feature");
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const chartTypeCollection = createListCollection({
    items: [
      { value: "heatmap", label: "Heatmap" },
      { value: "line", label: "Line Chart" },
    ],
  });

  const heatmapTypeCollection = createListCollection({
    items: [
      { value: "frequency", label: "Frequency Heatmap" },
      { value: "jaccard", label: "Jaccard Similarity (Internal Consistency)" },
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

    // If jaccard heatmap, use all runs from selected features
    if (heatmapType === "jaccard" && selectedFeatures.length > 0) {
      runsToUse = runs
        .filter((run) => selectedFeatures.includes(run.feature.name))
        .map((run) => String(run.id));
    }
    // If feature mode, get all runs with the selected features
    else if (selectionMode === "feature" && selectedFeatures.length > 0) {
      runsToUse = runs
        .filter((run) => selectedFeatures.includes(run.feature.name))
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
                    const newType = details.value[0] as HeatmapType;
                    setHeatmapType(newType);
                    // When switching to jaccard, select all features by default
                    if (newType === "jaccard") {
                      setSelectedFeatures(uniqueFeatures);
                    }
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
                    : "Shows ranking consistency using Jaccard similarity by feature and position"}
                </Text>
              </Flex>
            )}

            {/* Selection Mode - shown only for frequency heatmap (jaccard always uses feature mode) */}
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
                    setSelectedFeatures([]);
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

            {/* Feature Selection - shown when selection mode is feature or for jaccard heatmap */}
            {chartType === "heatmap" && (heatmapType === "jaccard" || (heatmapType === "frequency" && selectionMode === "feature")) && (
              <Flex direction="column" gap={2}>
                {heatmapType === "jaccard" && (
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Select Features</Text>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => {
                        setSelectedFeatures(uniqueFeatures);
                      }}
                    >
                      Select All
                    </Button>
                  </Flex>
                )}
                {heatmapType === "frequency" && (
                  <Text fontWeight="medium">Select Feature</Text>
                )}
                <Text textStyle="sm" color="fg.muted">
                  {heatmapType === "jaccard"
                    ? "Select features to compare (minimum 1 required)"
                    : "All runs with this feature will be included"}
                </Text>
                <Select.Root
                  collection={featuresCollection}
                  value={selectedFeatures}
                  onValueChange={(details) => {
                    setSelectedFeatures(details.value);
                  }}
                  multiple={heatmapType === "jaccard"}
                  size="sm"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Select features" />
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

            {/* Runs Selection - shown for line chart or when not using feature mode for heatmap */}
            {(chartType === "line" || !(chartType === "heatmap" && (heatmapType === "jaccard" || (heatmapType === "frequency" && selectionMode === "feature")))) && (
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
              chartType === "line" ? selectedRuns.length === 0 : (
                heatmapType === "jaccard" ? selectedFeatures.length === 0 : (
                  (selectionMode === "runs" && selectedRuns.length === 0) ||
                  (selectionMode === "feature" && selectedFeatures.length === 0)
                )
              )
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
