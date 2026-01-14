"use client"

import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

// Teal color palette from https://www.color-hex.com/color-palette/4666
const tealPalette = {
  50: "#f0f9f9",   // Lighter variant for backgrounds
  100: "#e0f3f3",  // Very light teal
  200: "#b2d8d8",  // Light teal
  300: "#99cccc",  // Medium-light teal
  400: "#66b2b2",  // Medium teal
  500: "#008080",  // Main teal
  600: "#006666",  // Dark teal
  700: "#005555",  // Darker teal
  800: "#004c4c",  // Very dark teal
  900: "#003333",  // Darkest teal
}

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Override the default teal colors with our palette
        teal: tealPalette,
        
        // Primary brand colors
        brand: {
          50: { value: tealPalette[50] },
          100: { value: tealPalette[100] },
          200: { value: tealPalette[200] },
          300: { value: tealPalette[300] },
          400: { value: tealPalette[400] },
          500: { value: tealPalette[500] },
          600: { value: tealPalette[600] },
          700: { value: tealPalette[700] },
          800: { value: tealPalette[800] },
          900: { value: tealPalette[900] },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Background colors using teal palette
        "bg.muted": {
          value: { base: tealPalette[50], _dark: "{colors.gray.800}" },
        },
        "bg.subtle": {
          value: { base: tealPalette[100], _dark: "{colors.gray.700}" },
        },
        
        // Accent colors
        "accent.default": {
          value: { base: tealPalette[500], _dark: tealPalette[400] },
        },
        "accent.emphasized": {
          value: { base: tealPalette[600], _dark: tealPalette[300] },
        },
        "accent.muted": {
          value: { base: tealPalette[200], _dark: tealPalette[700] },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
