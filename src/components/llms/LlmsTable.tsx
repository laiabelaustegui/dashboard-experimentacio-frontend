"use client";

import { Center, Spinner, Text, IconButton, Table } from "@chakra-ui/react";
import { IoPencil, IoTrash } from "react-icons/io5";
import { useLLMs } from "./useLLM";


export const LlmsTable = () => {
  const { llms, isLoading, isError, error, deleteLLM } = useLLMs();

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={8}>
        <Text color="red.500">
          Error: {error?.message ?? "Unknown error"}
        </Text>
      </Center>
    );
  }

  if (llms.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">No models found.</Text>
      </Center>
    );
  }

  return (
    <Table.Root size="md" variant="outline" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Provider</Table.ColumnHeader>
          <Table.ColumnHeader>Creation Date</Table.ColumnHeader>
          <Table.ColumnHeader>Endpoint</Table.ColumnHeader>

          <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {llms.map((llm) => (
          <Table.Row key={llm.id}>
            <Table.Cell>{llm.name}</Table.Cell>
            <Table.Cell>{llm.provider}</Table.Cell>
            <Table.Cell>{llm.creation_date.slice(0, 10)}</Table.Cell>
            <Table.Cell>{llm.API_endpoint}</Table.Cell>
            <Table.Cell textAlign="end">
              <IconButton 
                aria-label="Edit" 
                size="sm" 
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
              >
                <IoPencil />
              </IconButton>
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteLLM(llm.id);
                }}
              >
                <IoTrash />
              </IconButton>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};
