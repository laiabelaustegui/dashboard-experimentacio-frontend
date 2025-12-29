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
import { useState } from "react";

type ChartType = "heatmap" | "line";

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
  const [selectedRuns, setSelectedRuns] = useState<string[]>([]);

  const chartTypeCollection = createListCollection({
    items: [
      { value: "heatmap", label: "Heatmap" },
      { value: "line", label: "Line Chart" },
    ],
  });

  const runsCollection = createListCollection({
    items: runs,
    itemToString: (run) => `Run #${runs.findIndex((r) => r.id === run.id) + 1} (id: ${run.id})`,
    itemToValue: (run) => String(run.id),
  });

  const handleGenerate = () => {
    // Build query params for the chart page
    const params = new URLSearchParams({
      experimentId: String(experimentId),
      chartType,
      runs: selectedRuns.join(","),
    });

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

            {/* Runs Selection */}
            <Flex direction="column" gap={2}>
              <Text fontWeight="medium">Select Runs</Text>
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

            {/* Additional parameters based on chart type */}
            {chartType === "heatmap" && (
              <Text textStyle="sm" color="fg.muted" fontStyle="italic">
                Heatmap will show the ranking positions across different mobile apps and runs
              </Text>
            )}

            {chartType === "line" && (
              <Text textStyle="sm" color="fg.muted" fontStyle="italic">
                Line chart will show the elapsed time trend across runs
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
            disabled={selectedRuns.length === 0}
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
