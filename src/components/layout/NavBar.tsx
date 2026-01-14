'use client'

import { Flex, Heading, IconButton } from "@chakra-ui/react"
import { IoHelpCircleOutline } from 'react-icons/io5'
import { useRouter } from "next/navigation"

export default function Navbar() {
    const router = useRouter();

    return (
        <Flex as="nav" bg="teal.600" color="white" p={4} justify="space-between" align="center">
            <Heading as="h1" size="md">
                LLM-Powered Mobile App Recommender Experimentation Dashboard
            </Heading>
            <IconButton
                aria-label="Help"
                variant="ghost"
                size="sm"
                onClick={() => router.push('/help')}
                color="white"
                _hover={{ bg: "teal.700" }}
            >
                <IoHelpCircleOutline />
            </IconButton>
        </Flex>
    );
}