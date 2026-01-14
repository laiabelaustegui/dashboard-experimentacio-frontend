"use client"

import { ChakraProvider } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { EmotionProvider } from "./emotion-provider"
import { system } from "@/theme"

export function Provider(props: ColorModeProviderProps) {
  return (
    <EmotionProvider>
      <ChakraProvider value={system}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </EmotionProvider>
  )
}
