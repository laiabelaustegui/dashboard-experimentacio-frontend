"use client";

import { Center, Spinner, Text, IconButton, Table } from "@chakra-ui/react";
import { IoPencil, IoTrash } from "react-icons/io5";
import { usePromptTemplates } from "./usePromptTemplates";
import { useRouter } from "next/navigation";

export const TemplatesTable = () => {
  const router = useRouter();
  const { templates, isLoading, isError, error, deleteTemplate } = usePromptTemplates();

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

  if (templates.length === 0) {
    return (
      <Center py={8}>
        <Text color="fg.muted">No prompt templates found.</Text>
      </Center>
    );
  }

  return (
    <Table.Root size="md" variant="outline" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Name</Table.ColumnHeader>
          <Table.ColumnHeader>Creation Date</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {templates.map((template) => (
          <Table.Row key={template.id}
              cursor="pointer"
              _hover={{bg: "bg.subtle"}}
              onClick={() => router.push(`/prompt-templates/${template.id}`)}
          >
            <Table.Cell>{template.name}</Table.Cell>
            <Table.Cell>{template.creation_date.slice(0, 10)}</Table.Cell>
            <Table.Cell textAlign="end">
              <IconButton aria-label="Edit" size="sm" variant="ghost">
                <IoPencil />
              </IconButton>
              <IconButton
                aria-label="Delete"
                size="sm"
                variant="ghost"
                colorPalette="red"
                onClick={() => deleteTemplate(template.id)}
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
