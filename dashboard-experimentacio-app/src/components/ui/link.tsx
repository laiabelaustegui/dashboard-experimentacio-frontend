import { Flex, Icon, LinkBox, LinkOverlay } from "@chakra-ui/react";
import NextLink from "next/link";

export type LinkProps = {
  href: string;
  title: string;
  icon: React.ReactNode;
  expanded?: boolean;
}

export default function Link({ href, title, icon, expanded }: LinkProps) {
    return (
        <LinkBox bgColor="gray.100" display="flex" p={2} w="100%">
            <LinkOverlay asChild>
                <Flex align="center" gap={4} w="100%">
                    <Icon color="blue.400">{icon}</Icon>
                    <NextLink href={href}>
                        {expanded ? title : ' '}
                    </NextLink>
                </Flex>
            </LinkOverlay>
        </LinkBox>
    );
}