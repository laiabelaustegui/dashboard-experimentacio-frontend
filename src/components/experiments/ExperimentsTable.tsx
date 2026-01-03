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
import { useRouter } from "next/navigation";
import { useExperiments } from "./useExperiments";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";

export const ExperimentsTable = () => {
    const router = useRouter();
    const { experiments, isLoading, isError, error, deleteExperiment } = useExperiments();

    // Hook reutilizable para filtros y ordenamiento
    const {
      searchQuery,
      setSearchQuery,
      sortField,
      setSortField,
      sortOrder,
      toggleSortOrder,
      filteredAndSortedData: filteredAndSortedExperiments,
    } = useTableFilters({
      data: experiments || [],
      searchFields: ["name"],
      defaultSortField: "execution_date",
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
          {/* Componente de filtros reutilizable */}
          <TableFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search experiments by name..."
            sortField={String(sortField)}
            onSortFieldChange={(value) => setSortField(value as keyof typeof filteredAndSortedExperiments[0])}
            sortOptions={[
              { value: "name", label: "Sort by Name" },
              { value: "execution_date", label: "Sort by Date" },
              { value: "status", label: "Sort by Status" },
            ]}
            sortOrder={sortOrder}
            onSortOrderToggle={toggleSortOrder}
          />

          {/* Tabla */}
          {filteredAndSortedExperiments.length === 0 ? (
            <Center py={8}>
              <Text color="fg.muted">
                {searchQuery ? "No experiments match your search." : "No experiments found."}
              </Text>
            </Center>
          ) : (
            <Table.Root size="md" variant="outline" interactive>
              <Table.Header>
                  <Table.Row>
                  <Table.ColumnHeader>Name</Table.ColumnHeader>
                  <Table.ColumnHeader>Creation Date</Table.ColumnHeader>
                  <Table.ColumnHeader>Status</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
                  </Table.Row>
              </Table.Header>
              <Table.Body>
                  {filteredAndSortedExperiments.map((experiment) => (
                  <Table.Row key={experiment.id}
                      cursor="pointer"
                      _hover={{bg: "bg.subtle"}}
                      onClick={() => router.push(`/experiments/${experiment.id}`)}
                  >
                      <Table.Cell>{experiment.name}</Table.Cell>
                      <Table.Cell>
                        {new Date(experiment.execution_date).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>{experiment.status}</Table.Cell>
                      <Table.Cell textAlign="end">
                      <IconButton
                          aria-label="Delete"
                          size="sm"
                          variant="ghost"
                          colorPalette="red"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteExperiment(experiment.id);
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
