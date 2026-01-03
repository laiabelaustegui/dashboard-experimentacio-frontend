"use client";

import { Center, Spinner, Text, IconButton, Table } from "@chakra-ui/react";
import { IoTrash } from "react-icons/io5";
import { useConfiguredModels } from "./useConfiguredModels";



export const ConfiguredModelsTable = () => {
  const { configuredModels, isLoading, isError, error, deleteConfiguredModel } = useConfiguredModels();

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

  if (configuredModels.length === 0) {
    return (
      <Center py={8}>
        <Text color="gray.500">No configured models found.</Text>
      </Center>
    );
  }

  return (
    <Table.Root size="md" variant="outline" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Short Name</Table.ColumnHeader>

          <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {configuredModels.map((configuredModel) => (
          <Table.Row key={configuredModel.id}>
            <Table.Cell>{configuredModel.short_name}</Table.Cell>
            <Table.Cell textAlign="end">
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConfiguredModel(configuredModel.id);
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
