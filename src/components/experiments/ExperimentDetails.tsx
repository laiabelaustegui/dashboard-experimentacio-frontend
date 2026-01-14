"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Stack,
  Text,
  createListCollection,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useExperiment } from "./useExperiment";
import ChartConfigModal from "./charts/ChartConfigModal";

export default function ExperimentDetails({ id }: { id: number }) {
  const { experiment, isLoading, isError, error } = useExperiment(id);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const creationDate = experiment?.execution_date.slice(0, 10);
  const runs = experiment?.runs ?? [];

  // colección para Select (usa directamente el array de runs)
  const collection = useMemo(
    () =>
      createListCollection({
        items: runs,
        itemToString: (run) => `Run (id: ${run.id})`,
        itemToValue: (run) => String(run.id),
      }),
    [runs],
  );

  const currentRun =
    runs.find((r) => String(r.id) === selectedRunId) ?? runs[0] ?? null;

  // Export functions
  const exportAsJSON = () => {
    // Create a clean, well-structured JSON for analysis
    // Note: criteria are LLM-generated and may vary between runs
    const exportData = {
      metadata: {
        experiment_id: experiment.id,
        experiment_name: experiment.name,
        execution_date: experiment.execution_date,
        status: experiment.status,
        total_runs: experiment.num_runs,
        exported_at: new Date().toISOString(),
      },
      runs: runs.map(run => ({
        run_id: run.id,
        model: {
          short_name: run.configured_model.short_name,
        },
        performance: {
          elapsed_time_seconds: run.elapsed_time,
        },
        criteria: run.ranking_criteria.map(c => ({
          name: c.name,
          description: c.description,
        })),
        rankings: run.mobile_app_rankings.map(ranking => ({
          rank: ranking.rank,
          mobile_app: ranking.mobile_app,
        })),
      })),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `experiment-${experiment.id}-results.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

  const exportAsCSV = () => {
    // Create normalized CSV structure - one row per ranked mobile app
    // Note: Criteria are LLM-generated and included per run
    const csvRows: string[] = [];
    
    // Header row with metadata
    csvRows.push(`# Experiment: ${experiment.name}`);
    csvRows.push(`# Execution Date: ${experiment.execution_date}`);
    csvRows.push(`# Status: ${experiment.status}`);
    csvRows.push(`# Note: Ranking criteria are LLM-generated and may vary per run`);
    csvRows.push(""); // Empty line separator
    
    // Data header - one row per ranking result
    csvRows.push("Run ID,Configured Model,Elapsed Time (s),Criteria Used,Rank,Mobile App");
    
    // Data rows - include criteria names per run
    runs.forEach((run) => {
      const criteriaNames = run.ranking_criteria.map(c => c.name).join("; ");
      run.mobile_app_rankings.forEach((ranking) => {
        const row = [
          run.id,
          `"${run.configured_model.short_name}"`,
          run.elapsed_time.toFixed(2),
          `"${criteriaNames}"`,
          ranking.rank,
          `"${ranking.mobile_app}"`
        ];
        csvRows.push(row.join(","));
      });
    });

    const csvContent = csvRows.join("\n");
    const dataBlob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `experiment-${experiment.id}-results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExportModalOpen(false);
  };

    if (isLoading || !experiment) {
        return (
        <Flex direction="column" gap={4} p={4} w="full">
            <Text color="fg.muted">Loading experiment...</Text>
        </Flex>
        );
    }

    if (isError) {
        return (
        <Flex direction="column" gap={4} p={4} w="full">
            <Text color="fg.error">
            Error loading experiment: {error?.message ?? "Unknown error"}
            </Text>
        </Flex>
        );
    }

  return (
    <Flex direction="column" gap={4} p={4} w="full" mb={8}>
      <Link href="/experiments" style={{ alignSelf: "flex-start" }}>
        <Button 
          as="span"
          variant="ghost"
          mb={2}
        >
          ← Back to Experiments
        </Button>
      </Link>
      
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          {experiment.name}
        </Heading>

        <Flex gap={3}>
          <Button
            colorPalette="teal"
            onClick={() => {
              setIsExportModalOpen(true);
            }}
            disabled={runs.length === 0}
          >
            Export results
          </Button>

          <Button
            colorPalette="teal"
            onClick={() => {
              setIsChartModalOpen(true);
            }}
            disabled={runs.length === 0}
          >
            Generate charts
          </Button>
        </Flex>
      </Flex>

      {/* tarjetas de resumen */}
      <Flex gap={4} wrap="wrap">
        <Card.Root flex="1" minW="200px">
          <Card.Body>
            <Text textStyle="sm" color="fg.muted">
              Status
            </Text>
            <Text fontWeight="semibold">{experiment.status}</Text>
          </Card.Body>
        </Card.Root>

        <Card.Root flex="1" minW="200px">
          <Card.Body>
            <Text textStyle="sm" color="fg.muted">
              Number of runs
            </Text>
            <Text fontWeight="semibold">{experiment.num_runs}</Text>
          </Card.Body>
        </Card.Root>

        <Card.Root flex="1" minW="200px">
          <Card.Body>
            <Text textStyle="sm" color="fg.muted">
              Execution date
            </Text>
            <Text fontWeight="semibold">{creationDate}</Text>
          </Card.Body>
        </Card.Root>
      </Flex>

      {/* selector de run con Select + createListCollection */}
      {runs.length > 0 && (
        <Box mt={4}>
          <Text mb={1} fontWeight="medium">
            Select run
          </Text>

          <Select.Root
            collection={collection}
            value={currentRun ? [String(currentRun.id)] : []}
            onValueChange={(details) => {
              const v = details.value[0];
              setSelectedRunId(v ?? null);
            }}
            size="sm"
            width="320px"
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder="Select run" />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
                <Select.ClearTrigger />
              </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
              <Select.Content>
                {collection.items.map((run) => (
                  <Select.Item key={run.id} item={run}>
                    Run #{runs.findIndex((r) => r.id === run.id) + 1} (id: {run.id})
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>
      )}

      {currentRun && (
        <Flex direction="column" gap={4} mt={6}>
            {/* Resumen de la run seleccionada */}
            <Flex gap={4} wrap="wrap">
            <Card.Root flex="1" minW="200px">
              <Card.Body>
                <Text textStyle="sm" color="fg.muted">
                  Run id
                </Text>
                <Text fontWeight="semibold">{currentRun.id}</Text>
              </Card.Body>
            </Card.Root>

            <Card.Root flex="1" minW="200px">
              <Card.Body>
                <Text textStyle="sm" color="fg.muted">
                  Elapsed time
                </Text>
                <Text fontWeight="semibold">
                  {currentRun.elapsed_time.toFixed(2)} s
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root flex="1" minW="200px">
              <Card.Body>
                <Text textStyle="sm" color="fg.muted">
                  Configured model used for the run
                </Text>
                <Text fontWeight="semibold">{currentRun.configured_model.short_name}</Text>
              </Card.Body>
            </Card.Root>
            </Flex>

            {/* Mobile app rankings */}
            <Box>
            <Heading as="h2" size="md" mb={2}>
                Mobile app rankings
            </Heading>
            <Text fontSize="sm" color="fg.muted" mb={4}>
                Results generated by {currentRun.configured_model.short_name} for Run #{runs.findIndex((r) => r.id === currentRun.id) + 1}
            </Text>
            <Stack gap={3}>
                {currentRun.mobile_app_rankings.map((item, index) => (
                <Card.Root 
                    key={item.id}
                    size="sm"
                    variant="subtle"
                    borderWidth="1px"
                    borderColor={index === 0 ? "teal.500/40" : "border"}
                    bg={index === 0 ? "teal.500/5" : "bg.muted"}
                >
                    <Card.Body py={3}>
                    <Flex justify="space-between" align="center" gap={4}>
                        <Flex align="center" gap={3} flex="1">
                        <Badge 
                            colorPalette={index === 0 ? "teal" : "gray"}
                            size="lg"
                            variant={index === 0 ? "solid" : "subtle"}
                            px={3}
                            py={1}
                            fontSize="md"
                            fontWeight="bold"
                        >
                            #{item.rank}
                        </Badge>
                        <Text 
                            fontWeight={index === 0 ? "semibold" : "medium"}
                            fontSize="md"
                        >
                            {item.mobile_app}
                        </Text>
                        </Flex>
                        {index === 0 && (
                        <Badge colorPalette="teal" variant="subtle" size="sm">
                            Top Ranked
                        </Badge>
                        )}
                    </Flex>
                    </Card.Body>
                </Card.Root>
                ))}
            </Stack>
            </Box>

            {/* Ranking criteria */}
            <Box>
            <Heading as="h2" size="md" mb={2}>
                Ranking criteria
            </Heading>
            <Text fontSize="sm" color="fg.muted" mb={4}>
                Criteria generated by the model to justify and explain the ranking in this run
            </Text>
            <Stack gap={3}>
                {currentRun.ranking_criteria.map((criterion, index) => (
                <Card.Root
                    key={criterion.id}
                    size="sm"
                    variant="subtle"
                    borderWidth="1px"
                    borderColor="border"
                >
                    <Card.Body py={3}>
                    <Flex gap={3} align="start">
                        <Badge 
                        colorPalette="teal"
                        variant="outline"
                        size="sm"
                        px={2}
                        >
                        {index + 1}
                        </Badge>
                        <Stack gap={1} flex="1">
                        <Text fontWeight="semibold" fontSize="sm">{criterion.name}</Text>
                        <Text fontSize="sm" color="fg.muted">
                            {criterion.description}
                        </Text>
                        </Stack>
                    </Flex>
                    </Card.Body>
                </Card.Root>
                ))}
            </Stack>
            </Box>
        </Flex>
        )}

      {/* Chart Configuration Modal */}
      <ChartConfigModal
        open={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        experimentId={experiment.id}
        runs={runs}
      />

      {/* Export Format Modal */}
      <Dialog.Root
        open={isExportModalOpen}
        onOpenChange={(e) => !e.open && setIsExportModalOpen(false)}
        size="md"
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Export Experiment Results</Dialog.Title>
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <Text mb={4}>
                  Select the format to export the experiment results:
                </Text>
                <Flex direction="column" gap={3}>
                  <Button
                    colorPalette="teal"
                    onClick={exportAsJSON}
                    width="full"
                  >
                    Export as JSON
                  </Button>
                  <Button
                    colorPalette="teal"
                    variant="outline"
                    onClick={exportAsCSV}
                    width="full"
                  >
                    Export as CSV
                  </Button>
                </Flex>
              </Dialog.Body>
              <Dialog.Footer>
                <Button
                  variant="outline"
                  onClick={() => setIsExportModalOpen(false)}
                >
                  Cancel
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Flex>
  );
}
