"use client";

import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Input,
  HStack,
} from "@chakra-ui/react";

const templates = [
  { name: "Prompt test", date: "01/11/2025" },
  { name: "Prompt template 1", date: "01/11/2025" },
  { name: "Prompt template 3", date: "01/11/2025" },
];

export default function PromptTemplatesPage() {
  return (
    <Flex direction="column" gap={6}>
      {/* Título + botón New */}
      <Flex justify="space-between" align="center">
        <Heading size="lg">Prompt Templates</Heading>
        <Button colorScheme="teal" size="sm">
          New
        </Button>
      </Flex>

      {/* Tabla */}
      <Box borderWidth="1px" borderRadius="lg" bg="bg.panel" overflow="hidden">
        <Table size="sm">
          <Thead bg="bg.subtle">
            <Tr>
              <Th>Name</Th>
              <Th>Creation Date</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {templates.map((tpl) => (
              <Tr key={tpl.name}>
                <Td>{tpl.name}</Td>
                <Td>{tpl.date}</Td>
                <Td>
                  <Button size="xs" variant="outline">
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Buscador + paginación (dummy) */}
      <Flex justify="space-between" align="center">
        <Input placeholder="search" maxW="200px" size="sm" />
        <HStack spacing={1}>
          <Button size="xs" variant="outline">
            1
          </Button>
          <Button size="xs" variant="outline">
            2
          </Button>
          <Button size="xs" variant="outline">
            3
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
