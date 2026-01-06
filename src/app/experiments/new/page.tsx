
import { Flex, Heading } from "@chakra-ui/react";
import { ExperimentForm } from "@/components/experiments/ExperimentForm";

export default function NewExperimentPage() {
  return (
    <Flex direction="column" gap={4} p={4} w="full" maxW="4xl" mx="auto">
      <ExperimentForm />
    </Flex>
  );  
}