"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { EmotionProvider } from "./emotion-provider"

export function Provider(props: ColorModeProviderProps) {
  return (
    <EmotionProvider>
      <ChakraProvider value={defaultSystem}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </EmotionProvider>
  )
}
