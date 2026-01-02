"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Text,
  createListCollection,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useExperiment } from "./useExperiment";
import ChartConfigModal from "./charts/ChartConfigModal";

export default function ExperimentDetails({ id }: { id: number }) {
  const { experiment, isLoading, isError, error } = useExperiment(id);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

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
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          {experiment.name}
        </Heading>

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
            <Box borderWidth="1px" rounded="md" p={3} bg="bg">
                {currentRun.mobile_app_rankings.map((item) => (
                <Flex
                    key={item.id}
                    justify="space-between"
                    py={1}
                    borderBottomWidth="1px"
                    _last={{ borderBottomWidth: 0 }}
                >
                    <Text>
                    #{item.rank} – {item.mobile_app}
                    </Text>
                </Flex>
                ))}
            </Box>
            </Box>

            {/* Ranking criteria */}
            <Box>
            <Heading as="h2" size="md" mb={2}>
                Ranking criteria
            </Heading>
            <Box borderWidth="1px" rounded="md" p={3} bg="bg">
                {currentRun.ranking_criteria.map((criterion) => (
                <Box
                    key={criterion.id}
                    py={2}
                    borderBottomWidth="1px"
                    _last={{ borderBottomWidth: 0 }}
                >
                    <Text fontWeight="semibold">{criterion.name}</Text>
                    <Text textStyle="sm" color="fg.muted">
                    {criterion.description}
                    </Text>
                </Box>
                ))}
            </Box>
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
    </Flex>
  );
}
