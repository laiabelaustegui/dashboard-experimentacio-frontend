import { TemplatesTable } from "@/components/prompttemplates/TemplatesTable";
import { Button, Flex, Heading, Link } from "@chakra-ui/react";

export default function PromptTemplatesPage() {
  return (
    // El gap es per l'espaiat entre elements i el p es per padding
    // al ser column es posen un sota l'altre
    <Flex direction="column" gap={4} p={4} w="full">
      {// 
      }
      <Flex justify="space-between" align="center">
        <Heading as="h1" size="lg">
          Prompt Templates
        </Heading>
        <Button
          as={Link}
          href="/prompttemplates/new"
          colorScheme="teal"
          size="sm"
        >
          New Prompt Template
        </Button>
      </Flex>
      <TemplatesTable />
    </Flex>
  );
}