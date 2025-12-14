import { Flex, Text } from "@chakra-ui/react"

export default function Navbar() {
    return (
        <Flex as="nav" bg="blue.subtle" color="fg" p={4}>
            <Text>LLM-Powered Mobile App Recommender Experimentation Dashboard</Text>
        </Flex>
    );
}