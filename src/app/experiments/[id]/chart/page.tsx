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
  const heatmapType = searchParams.get("heatmapType") || "frequency";
  const selectedRunIds = searchParams.get("runs")?.split(",").map(Number) || [];

  // Filter runs based on selection
  const selectedRuns = useMemo(() => {
    if (!experiment) return [];
    return experiment.runs.filter((run) => selectedRunIds.includes(run.id));
  }, [experiment, selectedRunIds]);

  // Generate heatmap data
  const heatmapOptions = useMemo(() => {
    if (chartType !== "heatmap" || selectedRuns.length === 0) return null;

    if (heatmapType === "jaccard") {
      // Jaccard Similarity Heatmap: X-axis = ranking positions, Y-axis = features
      // Value = Jaccard similarity of the set of apps at that position across runs with the same feature
      
      // Group runs by feature
      const runsByFeature = selectedRuns.reduce((acc, run) => {
        const featureName = run.feature.name;
        if (!acc[featureName]) {
          acc[featureName] = [];
        }
        acc[featureName].push(run);
        return acc;
      }, {} as Record<string, typeof selectedRuns>);

      // Get all unique ranking positions
      const allRanks = Array.from(
        new Set(
          selectedRuns.flatMap((run) =>
            run.mobile_app_rankings.map((r) => r.rank)
          )
        )
      ).sort((a, b) => a - b);

      // Calculate Jaccard similarity for each feature at each position
      const series = Object.entries(runsByFeature).map(([featureName, runs]) => {
        // Only calculate if there are at least 2 runs for this feature
        const data = allRanks.map((rank) => {
          if (runs.length < 2) {
            return 0; // Can't calculate similarity with less than 2 runs
          }

          // Get the set of apps at this position for each run
          const appSetsAtPosition = runs.map((run) => {
            const appsAtRank = run.mobile_app_rankings
              .filter((r) => r.rank === rank)
              .map((r) => r.mobile_app);
            return new Set(appsAtRank);
          });

          // Calculate average pairwise Jaccard similarity
          let totalSimilarity = 0;
          let pairCount = 0;

          for (let i = 0; i < appSetsAtPosition.length; i++) {
            for (let j = i + 1; j < appSetsAtPosition.length; j++) {
              const setA = appSetsAtPosition[i];
              const setB = appSetsAtPosition[j];

              // Calculate Jaccard similarity: |A ∩ B| / |A ∪ B|
              const intersection = new Set([...setA].filter(x => setB.has(x)));
              const union = new Set([...setA, ...setB]);

              const jaccardSimilarity = union.size > 0 
                ? intersection.size / union.size 
                : 0;

              totalSimilarity += jaccardSimilarity;
              pairCount++;
            }
          }

          // Return average Jaccard similarity (0 to 1)
          return pairCount > 0 ? totalSimilarity / pairCount : 0;
        });

        return {
          name: featureName,
          data,
        };
      });

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
            formatter: (val: number) => val.toFixed(2),
            style: {
              colors: ['#000000'],
              fontSize: '12px',
              fontWeight: 'bold',
            },
          },
          colors: ["#FFEB3B"],
          xaxis: {
            categories: allRanks.map(rank => `${rank}`),
            title: {
              text: "Ranking Position",
            },
          },
          yaxis: {
            title: {
              text: "Features",
            },
            labels: {
              maxWidth: 400,
              style: {
                fontSize: '11px',
              },
            },
          },
          title: {
            text: "App Ranking Internal Consistency (Jaccard Similarity)",
            align: "center" as const,
          },
          subtitle: {
            text: "Higher values indicate more consistent app rankings across runs",
            align: "center" as const,
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              radius: 2,
              useFillColorAsStroke: false,
              distributed: false,
              colorScale: {
                min: 0,
                max: 1,
                ranges: [
                  {
                    from: 0,
                    to: 0.2,
                    color: '#FDD835',
                    name: 'Very Low',
                  },
                  {
                    from: 0.2,
                    to: 0.4,
                    color: '#FBC02D',
                    name: 'Low',
                  },
                  {
                    from: 0.4,
                    to: 0.6,
                    color: '#66BB6A',
                    name: 'Medium',
                  },
                  {
                    from: 0.6,
                    to: 0.8,
                    color: '#42A5F5',
                    name: 'High',
                  },
                  {
                    from: 0.8,
                    to: 1,
                    color: '#1565C0',
                    name: 'Very High',
                  },
                ],
              },
            },
          },
          tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }: any) => {
              const featureName = w.config.series[seriesIndex].name;
              const position = allRanks[dataPointIndex];
              const similarity = w.config.series[seriesIndex].data[dataPointIndex];
              const percentage = (similarity * 100).toFixed(1);
              
              return `<div style="padding: 8px; background: white; border: 1px solid #ccc;">
                <strong>${featureName}</strong><br/>
                Position: ${position}<br/>
                Jaccard Similarity: ${similarity.toFixed(1)} (${percentage}%)
              </div>`;
            },
          },
        },
        series,
      };
    } else if (heatmapType === "frequency") {
      // Frequency Heatmap: X-axis = ranking positions, Y-axis = apps, value = frequency
      const mobileApps = Array.from(
        new Set(
          selectedRuns.flatMap((run) =>
            run.mobile_app_rankings.map((r) => r.mobile_app)
          )
        )
      ).sort();

      // Get the feature name from selected runs
      const featureName = selectedRuns.length > 0 ? selectedRuns[0].feature.name : "";

      // Get all unique ranking positions
      const allRanks = Array.from(
        new Set(
          selectedRuns.flatMap((run) =>
            run.mobile_app_rankings.map((r) => r.rank)
          )
        )
      ).sort((a, b) => a - b);

      // Calculate frequency: for each app, count how many times it appears at each position
      const series = mobileApps.map((app) => ({
        name: app,
        data: allRanks.map((rank) => {
          // Count how many times this app appears at this rank across all selected runs
          const frequency = selectedRuns.filter((run) =>
            run.mobile_app_rankings.some((r) => r.mobile_app === app && r.rank === rank)
          ).length;
          return frequency;
        }),
      }));

      const maxFrequency = Math.max(...series.flatMap((s) => s.data), 1);

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
            style: {
              colors: ['#000000'],
              fontSize: '12px',
              fontWeight: 'bold',
            },
          },
          colors: ["#FFEB3B"],
          xaxis: {
            categories: allRanks.map(rank => `${rank}`),
            title: {
              text: "Ranking Position",
            },
          },
          yaxis: {
            title: {
              text: "Mobile Apps",
            },
            labels: {
              maxWidth: 400,
              style: {
                fontSize: '11px',
              },
            },
          },
          title: {
            text: `App Frequency by Ranking Position - ${featureName}`,
            align: "center" as const,
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              radius: 2,
              useFillColorAsStroke: false,
              distributed: false,
              colorScale: {
                min: 0,
                max: maxFrequency,
                ranges: [
                  {
                    from: 0,
                    to: maxFrequency * 0.2,
                    color: '#FDD835',
                    name: 'Very Low',
                  },
                  {
                    from: maxFrequency * 0.2,
                    to: maxFrequency * 0.4,
                    color: '#FBC02D',
                    name: 'Low',
                  },
                  {
                    from: maxFrequency * 0.4,
                    to: maxFrequency * 0.6,
                    color: '#66BB6A',
                    name: 'Medium',
                  },
                  {
                    from: maxFrequency * 0.6,
                    to: maxFrequency * 0.8,
                    color: '#42A5F5',
                    name: 'High',
                  },
                  {
                    from: maxFrequency * 0.8,
                    to: maxFrequency,
                    color: '#1565C0',
                    name: 'Very High',
                  },
                ],
              },
            },
          },
        },
        series,
      };
    }
  }, [chartType, heatmapType, selectedRuns, experiment]);

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
          showForSingleSeries: true,
          position: "top" as const,
          horizontalAlign: "left" as const,
          floating: false,
          fontSize: '14px',
          fontFamily: 'inherit',
          fontWeight: 500,
          offsetY: 0,
          offsetX: 0,
          labels: {
            colors: undefined,
            useSeriesColors: false,
          },
          markers: {
            width: 14,
            height: 14,
            strokeWidth: 0,
            radius: 12,
          },
          itemMargin: {
            horizontal: 15,
            vertical: 8,
          },
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
          {experiment.name} - {
            chartType === "heatmap" 
              ? heatmapType === "frequency" 
                ? "Frequency Heatmap"
                : "Jaccard Similarity Heatmap"
              : "Line Chart"
          }
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
                height={Math.max(400, heatmapOptions.series.length * 60)}
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
