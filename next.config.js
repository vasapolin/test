/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // No intentes cargar módulos nativos de Node.js en el cliente
      config.resolve.fallback = {
        fs: false,
        dns: false,
        net: false,
        tls: false,
        pg: false,
        'pg-native': false,
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
  }
};

module.exports = nextConfig; 