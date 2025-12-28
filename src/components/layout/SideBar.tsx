'use client'

import { useState } from 'react'
import { IoSpeedometerOutline, IoMenu } from 'react-icons/io5'
import { AiOutlineExperiment, AiOutlineFile, AiOutlineRobot } from "react-icons/ai"
import { Flex } from '@chakra-ui/react'
import Link from '@/components/ui/link'

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    // Sidebar con fondo gris claro
    <Flex
      flexDir="column"
      gap={2}
      p={2}
      w={isOpen ? '200px' : '50px'}
      h="full"
      overflowY="auto"
      bg="bg.muted"      // ← semantic token instead of gray.100
    >
      <Flex
        cursor="pointer"
        onClick={() => setIsOpen(prev => !prev)}
        p={2}
        w="100%"
        _hover={{ bg: "bg.subtle" }}
        borderRadius="md"
      >
        <IoMenu color="var(--chakra-colors-blue-400)" />
      </Flex>

      <Link expanded={isOpen} href="/" icon={<IoSpeedometerOutline />} title="Dashboard" />
      <Link expanded={isOpen} href="/llms" icon={<AiOutlineRobot />} title="Models" />
      <Link expanded={isOpen} href="/prompt-templates" icon={<AiOutlineFile />} title="Prompt Templates" />
      <Link expanded={isOpen} href="/experiments" icon={<AiOutlineExperiment />} title="Experiments" />
    </Flex>
  )
}
