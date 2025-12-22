// src/lib/emotion-cache.ts
import createCache from "@emotion/cache";

export function createEmotionCache() {
  // "chakra" es la key recomendada para Chakra UI
  return createCache({ key: "chakra", prepend: true });
}
