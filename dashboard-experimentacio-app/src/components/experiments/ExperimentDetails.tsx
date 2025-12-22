"use client";

import {
  Flex,
  Heading,
  Text,
  Box,
  Select,
  createListCollection,
  Button,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useExperiment } from "./useExperiment";

export default function ExperimentDetails({ id }: { id: number }) {
  const { experiment, isLoading, isError, error } = useExperiment(id);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

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
            <Text color="gray.600">Loading experiment...</Text>
        </Flex>
        );
    }

    if (isError) {
        return (
        <Flex direction="column" gap={4} p={4} w="full">
            <Text color="red.500">
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
          colorScheme="teal"
          onClick={() => {
            // aquí luego disparas la lógica de generación de gráficos
            // por ahora, por ejemplo:
            console.log("Generate charts for experiment", experiment.id);
          }}
        >
          Generate charts
        </Button>
      </Flex>

      {/* tarjetas de resumen */}
      <Flex gap={4} wrap="wrap">
        <Box flex="1" minW="200px" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontSize="sm" color="gray.500">
            Status
          </Text>
          <Text fontWeight="semibold">{experiment.status}</Text>
        </Box>

        <Box flex="1" minW="200px" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontSize="sm" color="gray.500">
            Number of runs
          </Text>
          <Text fontWeight="semibold">{experiment.num_runs}</Text>
        </Box>

        <Box flex="1" minW="200px" p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <Text fontSize="sm" color="gray.500">
            Execution date
          </Text>
          <Text fontWeight="semibold">{creationDate}</Text>
        </Box>
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
            <Box
                flex="1"
                minW="200px"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
            >
                <Text fontSize="sm" color="gray.500">
                Run id
                </Text>
                <Text fontWeight="semibold">{currentRun.id}</Text>
            </Box>

            <Box
                flex="1"
                minW="200px"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
            >
                <Text fontSize="sm" color="gray.500">
                Elapsed time
                </Text>
                <Text fontWeight="semibold">
                {currentRun.elapsed_time.toFixed(2)} s
                </Text>
            </Box>

            <Box
                flex="1"
                minW="200px"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                bg="gray.50"
            >
                <Text fontSize="sm" color="gray.500">
                Configured model id
                </Text>
                <Text fontWeight="semibold">{currentRun.configured_model}</Text>
            </Box>
            </Flex>

            {/* Mobile app rankings */}
            <Box>
            <Heading as="h2" size="md" mb={2}>
                Mobile app rankings
            </Heading>
            <Box borderWidth="1px" borderRadius="md" p={3} bg="white">
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
            <Box borderWidth="1px" borderRadius="md" p={3} bg="white">
                {currentRun.ranking_criteria.map((criterion) => (
                <Box
                    key={criterion.id}
                    py={2}
                    borderBottomWidth="1px"
                    _last={{ borderBottomWidth: 0 }}
                >
                    <Text fontWeight="semibold">{criterion.name}</Text>
                    <Text fontSize="sm" color="gray.600">
                    {criterion.description}
                    </Text>
                </Box>
                ))}
            </Box>
            </Box>
        </Flex>
        )}
    </Flex>
  );
}
