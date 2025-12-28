"use client";

import { Button, Card, Heading, Stack, type ButtonProps } from "@chakra-ui/react";
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
    <Card.Root>
      <Card.Body>
        <Heading size="sm" mb={3}>
          {title}
        </Heading>
        <Stack direction="row" gap={2} wrap="wrap">
          {actions.map((action) => (
            <Button
              key={action.label}
              asChild
              size="sm"
              {...action.props}
            >
              <Link href={action.href}>
                {action.label}
              </Link>
            </Button>
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
