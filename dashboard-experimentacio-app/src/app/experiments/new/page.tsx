
import { Flex, Heading } from "@chakra-ui/react";

export default function NewExperimentPage() {
  return (
      <Flex direction="column" gap={4} p={4} w="full">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="lg">
            Create Experiment
          </Heading>
        </Flex>
      </Flex>
  );  
}