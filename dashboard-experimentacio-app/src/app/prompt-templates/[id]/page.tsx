import TemplateDetails from "@/components/prompt-templates/TemplateDetails";

export default async function PromptTemplateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const {id} = await params;
  const parsedId = Number(id);

  return <TemplateDetails id={parsedId} />;
}
