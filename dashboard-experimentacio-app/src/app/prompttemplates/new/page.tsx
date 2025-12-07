import { Flex, Heading } from "@chakra-ui/react"
import { TemplateForm } from "@/components/prompttemplates/TemplateForm";

export default function NewPromptTemplatePage() {
  return (
    // El gap es per l'espaiat entre elements i el p es per padding
    // al ser column es posen un sota l'altre
    <Flex direction="column" gap={4} p={4} w="full">
        <TemplateForm />
    </Flex>
    );
}