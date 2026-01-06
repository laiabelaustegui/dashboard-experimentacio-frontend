import { useState, useMemo } from "react";

export type SortOrder = "asc" | "desc";

export interface UseTableFiltersOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  defaultSortField: keyof T;
  defaultSortOrder?: SortOrder;
}

export function useTableFilters<T>({
  data,
  searchFields,
  defaultSortField,
  defaultSortOrder = "desc",
}: UseTableFiltersOptions<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof T>(defaultSortField);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const filteredAndSortedData = useMemo(() => {
    if (!data) return [];

    // Filtrar por múltiples campos
    const filtered = data.filter((item) => {
      if (!searchQuery) return true;
      
      return searchFields.some((field) => {
        const value = item[field];
        if (typeof value === "string") {
          return value.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    });

    // Ordenar
    const result = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      let comparison = 0;

      // Ordenamiento para strings
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      }
      // Ordenamiento para fechas
      else if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      }
      // Ordenamiento para strings de fechas
      else if (typeof aValue === "string" && typeof bValue === "string") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
          comparison = dateA.getTime() - dateB.getTime();
        }
      }
      // Ordenamiento para números
      else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [data, searchQuery, searchFields, sortField, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return {
    searchQuery,
    setSearchQuery,
    sortField,
    setSortField,
    sortOrder,
    toggleSortOrder,
    filteredAndSortedData,
  };
}
