"use client";

import { Center, Spinner, Text, IconButton, Table } from "@chakra-ui/react";
import { IoPencil, IoTrash } from "react-icons/io5";
import { useConfigurations } from "./useConfigurations";



export const ConfigurationsTable = () => {
  const { configurations, isLoading, isError, error, deleteConfiguration } = useConfigurations();

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

  if (configurations.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">No configurations found.</Text>
      </Center>
    );
  }

  return (
    <Table.Root size="md" variant="outline" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Temperature</Table.ColumnHeader>
          <Table.ColumnHeader>Top P</Table.ColumnHeader>

          <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {configurations.map((configuration) => (
          <Table.Row key={configuration.id}>
            <Table.Cell>{configuration.name}</Table.Cell>
            <Table.Cell>{configuration.temperature}</Table.Cell>
            <Table.Cell>{configuration.topP}</Table.Cell>
            <Table.Cell textAlign="end">
              <IconButton aria-label="Edit" size="sm" variant="ghost">
                <IoPencil />
              </IconButton>
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => deleteConfiguration(configuration.id)}
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
