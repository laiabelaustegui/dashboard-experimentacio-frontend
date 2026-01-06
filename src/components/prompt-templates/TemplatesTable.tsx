"use client";

import { 
  Center, 
  Spinner, 
  Text, 
  IconButton, 
  Table,
  Stack,
  Button,
  Dialog,
} from "@chakra-ui/react";
import { IoPencil, IoTrash, IoCopy } from "react-icons/io5";
import { usePromptTemplates } from "./usePromptTemplates";
import { useRouter } from "next/navigation";
import { useTableFilters } from "@/hooks/useTableFilters";
import { TableFilters } from "@/components/ui/table-filters";
import { useState } from "react";

export const TemplatesTable = () => {
  const router = useRouter();
  const { templates, isLoading, isError, error, deleteTemplate, getTemplate } = usePromptTemplates();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  
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

  const handleDeleteClick = (e: React.MouseEvent, templateId: number) => {
    e.stopPropagation();
    const template = getTemplate(templateId);
    
    // Si el template tiene experimentos asociados, mostrar el diálogo de confirmación
    if (template && template.experiments_count && template.experiments_count > 0) {
      setTemplateToDelete(templateId);
      setDeleteDialogOpen(true);
    } else {
      // Si no tiene experimentos, borrar directamente
      deleteTemplate(templateId);
    }
  };

  const handleDuplicateClick = (e: React.MouseEvent, templateId: number) => {
    e.stopPropagation();
    const template = getTemplate(templateId);
    if (template) {
      // Redirigir a la página de creación con los datos del template
      router.push(`/prompt-templates/new?duplicate=${templateId}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (templateToDelete !== null) {
      await deleteTemplate(templateToDelete);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTemplateToDelete(null);
  };

  const currentTemplate = templateToDelete !== null ? getTemplate(templateToDelete) : null;

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
                    aria-label="Duplicate" 
                    size="sm" 
                    variant="ghost"
                    colorPalette="blue"
                    onClick={(e) => handleDuplicateClick(e, template.id)}
                  >
                    <IoCopy />
                  </IconButton>
                  <IconButton
                    aria-label="Delete"
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    onClick={(e) => handleDeleteClick(e, template.id)}
                  >
                    <IoTrash />
                  </IconButton>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* Diálogo de confirmación para borrar template con experimentos */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={(e) => !e.open && handleCancelDelete()}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Delete Template with Experiments</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Text>
                This template <strong>&quot;{currentTemplate?.name}&quot;</strong> is being used by{" "}
                <strong>{currentTemplate?.experiments_count || 0} experiment(s)</strong>.
              </Text>
              <Text mt={2}>
                Deleting this template will also permanently delete all associated experiments.
              </Text>
              <Text mt={2} fontWeight="bold" color="red.500">
                Are you sure you want to continue?
              </Text>
            </Dialog.Body>
            <Dialog.Footer>
              <Button variant="outline" onClick={handleCancelDelete}>
                Cancel
              </Button>
              <Button colorPalette="red" onClick={handleConfirmDelete}>
                Delete Template and Experiments
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Stack>
  );
};
