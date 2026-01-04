"use client";

import { CacheProvider } from "@emotion/react";
import { ReactNode } from "react";
import { createEmotionCache } from "@/lib/emotion-cache";

// Crear el cache fuera del componente para evitar problemas de hidratación
const cache = createEmotionCache();

export function EmotionProvider({ children }: { children: ReactNode }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
