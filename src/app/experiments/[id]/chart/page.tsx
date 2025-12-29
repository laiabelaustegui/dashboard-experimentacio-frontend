"use client";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, use } from "react";
import { useExperiment } from "@/components/experiments/useExperiment";

// Import ApexCharts dynamically to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function ChartPageContent({ experimentId }: { experimentId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { experiment, isLoading, isError } = useExperiment(Number(experimentId));

  const chartType = searchParams.get("chartType") || "heatmap";
  const selectedRunIds = searchParams.get("runs")?.split(",").map(Number) || [];

  // Filter runs based on selection
  const selectedRuns = useMemo(() => {
    if (!experiment) return [];
    return experiment.runs.filter((run) => selectedRunIds.includes(run.id));
  }, [experiment, selectedRunIds]);

  // Generate heatmap data
  const heatmapOptions = useMemo(() => {
    if (chartType !== "heatmap" || selectedRuns.length === 0) return null;

    // Get all unique mobile apps
    const mobileApps = Array.from(
      new Set(
        selectedRuns.flatMap((run) =>
          run.mobile_app_rankings.map((r) => r.mobile_app)
        )
      )
    ).sort();

    // Create series data for heatmap
    const series = selectedRuns.map((run, index) => ({
      name: `Run #${experiment!.runs.findIndex((r) => r.id === run.id) + 1}`,
      data: mobileApps.map((app) => {
        const ranking = run.mobile_app_rankings.find((r) => r.mobile_app === app);
        return ranking ? ranking.rank : 0;
      }),
    }));

    return {
      options: {
        chart: {
          type: "heatmap" as const,
          toolbar: {
            show: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        colors: ["#008FFB"],
        xaxis: {
          categories: mobileApps,
          title: {
            text: "Mobile Apps",
          },
        },
        yaxis: {
          title: {
            text: "Runs",
          },
        },
        title: {
          text: "Mobile App Rankings Heatmap",
          align: "center" as const,
        },
        plotOptions: {
          heatmap: {
            shadeIntensity: 0.5,
            colorScale: {
              ranges: [
                { from: 1, to: 1, color: "#00A100", name: "1st" },
                { from: 2, to: 2, color: "#128FD9", name: "2nd" },
                { from: 3, to: 3, color: "#FFB200", name: "3rd" },
                { from: 4, to: 10, color: "#FF0000", name: "4th+" },
              ],
            },
          },
        },
      },
      series,
    };
  }, [chartType, selectedRuns, experiment]);

  // Generate line chart data
  const lineChartOptions = useMemo(() => {
    if (chartType !== "line" || selectedRuns.length === 0) return null;

    // Agrupar runs por modelo configurado
    const runsByModel = selectedRuns.reduce((acc, run) => {
      const modelName = run.configured_model.short_name;
      if (!acc[modelName]) {
        acc[modelName] = [];
      }
      acc[modelName].push(run);
      return acc;
    }, {} as Record<string, typeof selectedRuns>);

    // Obtener el número máximo de posiciones (rankings)
    const maxRank = Math.max(
      ...selectedRuns.flatMap((run) =>
        run.mobile_app_rankings.map((r) => r.rank)
      )
    );

    // Crear una serie por cada modelo configurado
    const series = Object.entries(runsByModel).map(([modelName, runs]) => {
      const data = [];
      for (let position = 1; position <= maxRank; position++) {
        const appsAtPosition = new Set<string>();
        
        runs.forEach((run) => {
          const ranking = run.mobile_app_rankings.find((r) => r.rank === position);
          if (ranking) {
            appsAtPosition.add(ranking.mobile_app);
          }
        });

        data.push({
          x: `${position}`,
          y: appsAtPosition.size,
        });
      }

      return {
        name: modelName,
        data,
      };
    });

    return {
      options: {
        chart: {
          type: "line" as const,
          toolbar: {
            show: true,
          },
        },
        stroke: {
          curve: "smooth" as const,
          width: 3,
        },
        markers: {
          size: 6,
        },
        xaxis: {
          title: {
            text: "Ranking Position",
          },
          min: 0,
          tickAmount: maxRank,
        },
        yaxis: {
          title: {
            text: "Number of Distinct Apps",
          },
          forceNiceScale: true,
          min: 0,
        },
        title: {
          text: "Distinct Apps per Ranking Position by Model",
          align: "center" as const,
        },
        legend: {
          show: true,
          position: "top" as const,
        },
      },
      series,
    };
  }, [chartType, selectedRuns, experiment]);

  if (isLoading) {
    return (
      <Flex direction="column" gap={4} p={4} w="full" align="center" justify="center" minH="400px">
        <Text color="fg.muted">Loading chart data...</Text>
      </Flex>
    );
  }

  if (isError || !experiment) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="fg.error">Error loading experiment data</Text>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Flex>
    );
  }

  if (selectedRuns.length === 0) {
    return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Text color="fg.muted">No runs selected</Text>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Flex>
    );
  }

  return (
    <Flex direction="column" gap={4} p={4} w="full">
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          {experiment.name} - {chartType === "heatmap" ? "Heatmap" : "Line Chart"}
        </Heading>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Experiment
        </Button>
      </Flex>

      <Card.Root>
        <Card.Body>
          <Box p={4}>
            {chartType === "heatmap" && heatmapOptions && (
              <Chart
                options={heatmapOptions.options}
                series={heatmapOptions.series}
                type="heatmap"
                height={400}
              />
            )}

            {chartType === "line" && lineChartOptions && (
              <Chart
                options={lineChartOptions.options}
                series={lineChartOptions.series}
                type="line"
                height={400}
              />
            )}
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Info about selected runs */}
      <Card.Root>
        <Card.Body>
          <Heading as="h2" size="md" mb={3}>
            Selected Runs
          </Heading>
          <Flex direction="column" gap={2}>
            {selectedRuns.map((run) => (
              <Flex key={run.id} justify="space-between" py={2} borderBottomWidth="1px">
                <Text>
                  Run #{experiment.runs.findIndex((r) => r.id === run.id) + 1} (ID: {run.id})
                </Text>
                <Text color="fg.muted">
                  {run.configured_model.short_name} - {run.elapsed_time.toFixed(2)}s
                </Text>
              </Flex>
            ))}
          </Flex>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}

export default function ExperimentChartPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ChartPageContent experimentId={resolvedParams.id} />
    </Suspense>
  );
}
