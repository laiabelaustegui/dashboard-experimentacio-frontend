"use client";

import {
  HStack,
  Input,
  InputGroup,
  NativeSelect,
  IconButton,
} from "@chakra-ui/react";
import { LuSearch, LuArrowUpDown } from "react-icons/lu";

export interface SortOption {
  value: string;
  label: string;
}

export interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  sortField: string;
  onSortFieldChange: (value: string) => void;
  sortOptions: SortOption[];
  sortOrder: "asc" | "desc";
  onSortOrderToggle: () => void;
}

export const TableFilters = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  sortField,
  onSortFieldChange,
  sortOptions,
  sortOrder,
  onSortOrderToggle,
}: TableFiltersProps) => {
  return (
    <HStack gap={3}>
      <InputGroup flex="1" maxW="sm" startElement={<LuSearch />}>
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </InputGroup>

      <NativeSelect.Root size="sm" width="auto">
        <NativeSelect.Field
          value={sortField}
          onChange={(e) => onSortFieldChange(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <IconButton
        aria-label={`Sort ${sortOrder === "asc" ? "descending" : "ascending"}`}
        size="sm"
        variant="outline"
        onClick={onSortOrderToggle}
      >
        <LuArrowUpDown />
      </IconButton>
    </HStack>
  );
};
