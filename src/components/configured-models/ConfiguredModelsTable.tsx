"use client";

import { 
  Center, 
  Spinner, 
  Text, 
  IconButton, 
  Table,
  Stack,
} from "@chakra-ui/react";
import { IoTrash } from "react-icons/io5";
import { useConfiguredModels } from "./useConfiguredModels";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";

export const ConfiguredModelsTable = () => {
  const { configuredModels, isLoading, isError, error, deleteConfiguredModel } = useConfiguredModels();

  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredAndSortedData: filteredAndSortedModels,
  } = useTableFilters({
    data: configuredModels || [],
    searchFields: ["short_name"],
    defaultSortField: "short_name",
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
        searchPlaceholder="Search by short name..."
        sortField={String(sortField)}
        onSortFieldChange={(value) => setSortField(value as keyof typeof filteredAndSortedModels[0])}
        sortOptions={[
          { value: "short_name", label: "Sort by Name" },
        ]}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
      />

      {filteredAndSortedModels.length === 0 ? (
        <Center py={8}>
          <Text color="fg.muted">
            {searchQuery ? "No configured models match your search." : "No configured models found."}
          </Text>
        </Center>
      ) : (
        <Table.Root size="md" variant="outline" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Short Name</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredAndSortedModels.map((configuredModel) => (
              <Table.Row key={configuredModel.id}>
                <Table.Cell>{configuredModel.short_name}</Table.Cell>
                <Table.Cell textAlign="end">
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
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
      )}
    </Stack>
  );
};
