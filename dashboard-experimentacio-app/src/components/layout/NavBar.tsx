'use client'

import { Flex, Heading, IconButton } from "@chakra-ui/react"
import { IoHelpCircleOutline, IoSettingsOutline } from 'react-icons/io5'
import { useRouter } from "next/navigation"

export default function Navbar() {
    const router = useRouter();

    return (
        <Flex as="nav" bg="blue.subtle" color="fg" p={4} justify="space-between" align="center">
            <Heading as="h1" size="md">
                LLM-Powered Mobile App Recommender Experimentation Dashboard
            </Heading>
            <Flex gap={2}>
                <IconButton
                    aria-label="Settings"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/settings')}
                >
                    <IoSettingsOutline />
                </IconButton>
                <IconButton
                    aria-label="Help"
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push('/help')}
                >
                    <IoHelpCircleOutline />
                </IconButton>
            </Flex>
        </Flex>
    );
}