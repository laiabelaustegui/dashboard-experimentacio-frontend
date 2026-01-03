"use client";

import { Center, Spinner, Text, IconButton, Table } from "@chakra-ui/react";
import { IoTrash } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useExperiments } from "./useExperiments";

export const ExperimentsTable = () => {
    const router = useRouter();
    const { experiments, isLoading, isError, error, deleteExperiment } = useExperiments();

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

    if (experiments.length === 0) {
        return (
        <Center py={8}>
            <Text color="fg.muted">No experiments found.</Text>
        </Center>
        );
    }

    return (
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
            {experiments.map((experiment) => (
            <Table.Row key={experiment.id}
                cursor="pointer"
                _hover={{bg: "bg.subtle"}}
                onClick={() => router.push(`/experiments/${experiment.id}`)}
            >
                <Table.Cell>{experiment.name}</Table.Cell>
                <Table.Cell>{experiment.execution_date.slice(0, 10)}</Table.Cell>
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
    );
    };
