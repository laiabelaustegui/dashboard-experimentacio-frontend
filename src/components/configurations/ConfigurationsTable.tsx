"use client";

import { 
  Center, 
  Spinner, 
  Text, 
  IconButton, 
  Table,
  Stack,
} from "@chakra-ui/react";
import { IoPencil, IoTrash } from "react-icons/io5";
import { useConfigurations } from "./useConfigurations";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";

export const ConfigurationsTable = () => {
  const { configurations, isLoading, isError, error, deleteConfiguration } = useConfigurations();

  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredAndSortedData: filteredAndSortedConfigurations,
  } = useTableFilters({
    data: configurations || [],
    searchFields: ["name"],
    defaultSortField: "name",
    defaultSortOrder: "asc",
  });

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
        <Text color="fg.error">
          Error: {error?.message ?? "Unknown error"}
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap={4}>
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name..."
        sortField={String(sortField)}
        onSortFieldChange={(value) => setSortField(value as keyof typeof filteredAndSortedConfigurations[0])}
        sortOptions={[
          { value: "name", label: "Sort by Name" },
          { value: "temperature", label: "Sort by Temperature" },
          { value: "topP", label: "Sort by Top P" },
        ]}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
      />

      {filteredAndSortedConfigurations.length === 0 ? (
        <Center py={8}>
          <Text color="fg.muted">
            {searchQuery ? "No configurations match your search." : "No configurations found."}
          </Text>
        </Center>
      ) : (
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
            {filteredAndSortedConfigurations.map((configuration) => (
              <Table.Row key={configuration.id}>
                <Table.Cell>{configuration.name}</Table.Cell>
                <Table.Cell>{configuration.temperature}</Table.Cell>
                <Table.Cell>{configuration.topP}</Table.Cell>
                <Table.Cell textAlign="end">
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConfiguration(configuration.id);
                    }}
                  >
                    <IoTrash />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Stack>
  );
};
