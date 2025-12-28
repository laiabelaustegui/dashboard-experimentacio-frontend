import { Flex, LinkBox, LinkOverlay, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export type LinkProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  expanded?: boolean;
}

export default function Link({ href, title, icon, expanded }: LinkProps) {
    return (
        <LinkBox 
          display="flex" 
          p={2} 
          w="100%"
          borderRadius="md"
          _hover={{ bg: "bg.subtle" }}
          transition="background 0.2s"
        >
            <Flex align="center" gap={4} w="100%">
                <Flex color="blue.400" fontSize="xl">
                    {icon}
                </Flex>
                {expanded && (
                    <LinkOverlay asChild>
                        <NextLink href={href}>
                            <Text>{title}</Text>
                        </NextLink>
                    </LinkOverlay>
                )}
            </Flex>
        </LinkBox>
    );
}