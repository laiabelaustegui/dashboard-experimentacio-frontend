"use client";

import { Input } from "@chakra-ui/react";

export function TemplatesSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      size="sm"
      placeholder="Search by name"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
