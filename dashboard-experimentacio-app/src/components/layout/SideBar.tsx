'use client'

import { useState } from 'react'
import { IoSpeedometerOutline, IoMenu, IoHelpCircleOutline, IoSettingsOutline } from 'react-icons/io5'
import { AiOutlineExperiment, AiOutlineFile, AiOutlineRobot } from "react-icons/ai"
import { Box, Flex, Icon } from '@chakra-ui/react'
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
      h="100vh"
      overflowY="auto"
      bg="gray.100"      // ← fondo para TODO el sidebar
    >
      <Flex
        cursor="pointer"
        onClick={() => setIsOpen(prev => !prev)}
        p={2}
        w="100%"
      >
        <Icon color="blue.400">
          <IoMenu />
        </Icon>
      </Flex>

      <Link expanded={isOpen} href="/" icon={<IoSpeedometerOutline />} title="Dashboard" />
      <Link expanded={isOpen} href="/models" icon={<AiOutlineRobot />} title="Models" />
      <Link
        expanded={isOpen}
        href="/prompttemplates"
        icon={<AiOutlineFile />}
        title="Prompt Templates"
      />
      <Link expanded={isOpen} href="/experiments" icon={<AiOutlineExperiment />} title="Experiments" />

      <Box mt="auto">
        <Link
          expanded={isOpen}
          href="/settings"
          icon={<IoSettingsOutline />}
          title="Settings"
        />
        <Link
          expanded={isOpen}
          href="/help"
          icon={<IoHelpCircleOutline />}
          title="Help"
        />
      </Box>
    </Flex>
  )
}
