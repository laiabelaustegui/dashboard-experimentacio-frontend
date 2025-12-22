import { Flex } from "@chakra-ui/react"
import { LLMForm } from "@/components/llms/LLMForm";

export default function NewLLMPage() {
  return (
    // El gap es per l'espaiat entre elements i el p es per padding
    // al ser column es posen un sota l'altre
    <Flex direction="column" gap={4} p={4} w="full">
        <LLMForm />
    </Flex>
    );
}