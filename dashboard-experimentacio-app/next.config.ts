import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  /* otras opciones de config aquí si las necesitas */
};

export default nextConfig;

