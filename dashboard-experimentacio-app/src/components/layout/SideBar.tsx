'use client'

import { useState } from 'react'
import { HiOutlineTemplate } from "react-icons/hi";
import { IoSpeedometerOutline, IoMenu } from 'react-icons/io5'
import { AiOutlineExperiment, AiOutlineRobot } from "react-icons/ai";

import { Flex, Icon } from '@chakra-ui/react'

import Link from '@/components/ui/link'

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <Flex flexDir="column" gap={2} p={2} w={isOpen ? '200px' : '50px'}>
      <Flex bgColor="gray.100" cursor="pointer" onClick={() => setIsOpen(prev => !prev)} p={2} w="100%">
        <Icon color="blue.400">
          <IoMenu />
        </Icon>
      </Flex>
      <Link expanded={isOpen} href="/" icon={<IoSpeedometerOutline />} title="Dashboard" />
      <Link expanded={isOpen} href="/models" icon={<AiOutlineRobot />} title="Models" />
      <Link
        expanded={isOpen}
        href="/prompttemplates"
        icon={<HiOutlineTemplate />}
        title="Prompt Templates"
      />
      <Link expanded={isOpen} href="/experiments" icon={<AiOutlineExperiment />} title="Experiments" />
    </Flex>
  )
}