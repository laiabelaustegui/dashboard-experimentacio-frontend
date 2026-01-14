import TemplateEdit from "@/components/prompt-templates/TemplateEdit";

export default async function PromptTemplateEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const {id} = await params;
  const parsedId = Number(id);

  return <TemplateEdit id={parsedId} />;
}
