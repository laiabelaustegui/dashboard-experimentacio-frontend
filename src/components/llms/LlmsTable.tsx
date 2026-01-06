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
import { useLLMs } from "./useLLM";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";

export const LlmsTable = () => {
  const { llms, isLoading, isError, error, deleteLLM } = useLLMs();

  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredAndSortedData: filteredAndSortedLLMs,
  } = useTableFilters({
    data: llms || [],
    searchFields: ["name", "provider"],
    defaultSortField: "creation_date",
    defaultSortOrder: "desc",
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
        searchPlaceholder="Search by name or provider..."
        sortField={String(sortField)}
        onSortFieldChange={(value) => setSortField(value as keyof typeof filteredAndSortedLLMs[0])}
        sortOptions={[
          { value: "name", label: "Sort by Name" },
          { value: "provider", label: "Sort by Provider" },
          { value: "creation_date", label: "Sort by Date" },
        ]}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
      />

      {filteredAndSortedLLMs.length === 0 ? (
        <Center py={8}>
          <Text color="fg.muted">
            {searchQuery ? "No models match your search." : "No models found."}
          </Text>
        </Center>
      ) : (
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
            {filteredAndSortedLLMs.map((llm) => (
              <Table.Row key={llm.id}>
                <Table.Cell>{llm.name}</Table.Cell>
                <Table.Cell>{llm.provider}</Table.Cell>
                <Table.Cell>{new Date(llm.creation_date).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{llm.API_endpoint}</Table.Cell>
                <Table.Cell textAlign="end">
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
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
      )}
    </Stack>
  );
};
