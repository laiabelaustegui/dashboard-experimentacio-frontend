// versión sin peleas con tipos
"use client";

import { Button } from "@chakra-ui/react";
import NextLink from "next/link";

type CreateNewButtonProps = {
  href: string;
  label: string;
};

export const CreateNewButton = ({ href, label }: CreateNewButtonProps) => {
  return (
    <NextLink href={href}>
      <Button
        as="span"
        colorScheme="teal"
        size="sm"
      >
        {label}
      </Button>
    </NextLink>
  );
};

