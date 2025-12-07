'use client'
import { Provider as ChakraProvider } from "@/components/ui/provider"
import SwrProvider from "./SwrProvider"


export function Providers({ children }: { children: React.ReactNode }) {
    return (
    <ChakraProvider>
        <SwrProvider>{children}</SwrProvider>
    </ChakraProvider>
    )
}