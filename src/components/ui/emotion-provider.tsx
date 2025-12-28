"use client";

import { CacheProvider } from "@emotion/react";
import { ReactNode, useState } from "react";
import { createEmotionCache } from "@/lib/emotion-cache";

export function EmotionProvider({ children }: { children: ReactNode }) {
  // Creamos el cache una sola vez por cliente
  const [cache] = useState(() => createEmotionCache());

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
