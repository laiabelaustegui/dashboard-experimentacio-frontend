import { For, Stack, Table } from "@chakra-ui/react"


export const TemplatesTable = () => {
  return (
    <Stack gap="10">
      <For each={["line", "outline"]}>
        {(variant) => (
          <Table.Root key={variant} size="sm" variant={variant}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Name</Table.ColumnHeader>
                <Table.ColumnHeader>Creation Date</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.creationDate}</Table.Cell>
                  <Table.Cell textAlign="end">{/* Actions go here */}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}      
        </For>
    </Stack>
  )
}

const items = [
  { id: 1, name: "Prompt Template 1", creationDate: "2023-01-01" },
  { id: 2, name: "Prompt Template 2", creationDate: "2023-02-15" },
  { id: 3, name: "Prompt Template 3", creationDate: "2023-03-10" },
]
