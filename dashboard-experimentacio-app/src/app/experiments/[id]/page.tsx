import ExperimentDetails from "@/components/experiments/ExperimentDetails";


export default async function ExperimentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const {id} = await params;
  const parsedId = Number(id);

  return <ExperimentDetails id={parsedId} />;
}