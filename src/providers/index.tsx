'use client'
import { Provider as ChakraProvider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import SwrProvider from "./SwrProvider"


export function Providers({ children }: { children: React.ReactNode }) {
    return (
    <ChakraProvider>
        <SwrProvider>
            {children}
            <Toaster />
        </SwrProvider>
    </ChakraProvider>
    )
}