"use client";

import { Box, Flex, Heading, Button, type ButtonProps } from "@chakra-ui/react";
import Link from "next/link";

interface QuickAction {
  href: string;
  label: string;
  props?: ButtonProps;
}

interface QuickActionCardProps {
  title: string;
  actions: QuickAction[];
}

export function QuickActionCard({ title, actions }: QuickActionCardProps) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="bg.panel">
      <Heading size="sm" mb={3}>
        {title}
      </Heading>
      <Flex gap={2} wrap="wrap">
        {actions.map((action) => (
          <Button
            key={action.label}
            as={Link}
            href={action.href}
            size="sm"
            {...action.props}
          >
            {action.label}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
