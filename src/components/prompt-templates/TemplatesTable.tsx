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
import { usePromptTemplates } from "./usePromptTemplates";
import { useRouter } from "next/navigation";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";

export const TemplatesTable = () => {
  const router = useRouter();
  const { templates, isLoading, isError, error, deleteTemplate } = usePromptTemplates();
  
  // Hook reutilizable para filtros y ordenamiento
  const {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredAndSortedData: filteredAndSortedTemplates,
  } = useTableFilters({
    data: templates || [],
    searchFields: ["name"],
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
      {/* Componente de filtros reutilizable */}
      <TableFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name..."
        sortField={String(sortField)}
        onSortFieldChange={(value) => setSortField(value as keyof typeof filteredAndSortedTemplates[0])}
        sortOptions={[
          { value: "name", label: "Sort by Name" },
          { value: "creation_date", label: "Sort by Date" },
        ]}
        sortOrder={sortOrder}
        onSortOrderToggle={toggleSortOrder}
      />

      {/* Tabla */}
      {filteredAndSortedTemplates.length === 0 ? (
        <Center py={8}>
          <Text color="fg.muted">
            {searchQuery ? "No templates match your search." : "No prompt templates found."}
          </Text>
        </Center>
      ) : (
        <Table.Root size="md" variant="outline" interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Creation Date</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredAndSortedTemplates.map((template) => (
              <Table.Row 
                key={template.id}
                cursor="pointer"
                _hover={{bg: "bg.subtle"}}
                onClick={() => router.push(`/prompt-templates/${template.id}`)}
              >
                <Table.Cell>{template.name}</Table.Cell>
                <Table.Cell>
                  {new Date(template.creation_date).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell textAlign="end">
                  <IconButton 
                    aria-label="Edit" 
                    size="sm" 
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/prompt-templates/${template.id}`);
                    }}
                  >
                    <IoPencil />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTemplate(template.id);
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
