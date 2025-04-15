/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Configuración explícita para asegurar que las características sean solo de servidor
  experimental: {
    serverExternalPackages: ["pg", "pg-native"],
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Solución más explícita para el lado del cliente
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        dns: false,
        net: false,
        tls: false,
        pg: false,
        "pg-native": false,
        crypto: false,
        stream: false,
        constants: false,
        os: false,
        path: false,
        child_process: false,
      };
    }
    return config;
  },

  // Asegúrate de que las API routes solo se ejecuten en el servidor
  serverRuntimeConfig: {
    // Configuraciones solo para el servidor
  },
  publicRuntimeConfig: {
    // Configuraciones para cliente y servidor
  },
};

module.exports = nextConfig;
