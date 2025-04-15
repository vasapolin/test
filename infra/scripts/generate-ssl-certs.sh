#!/bin/bash

# Crear directorio para certificados si no existe
mkdir -p ../ssl

# Generar clave privada
openssl genrsa -out ../ssl/server.key 2048

# Generar CSR
openssl req -new -key ../ssl/server.key -out ../ssl/server.csr -subj "/CN=localhost"

# Generar certificado autofirmado
openssl x509 -req -days 365 -in ../ssl/server.csr -signkey ../ssl/server.key -out ../ssl/server.crt

# Ajustar permisos
chmod 600 ../ssl/server.key
chmod 644 ../ssl/server.crt

echo "Certificados SSL generados en infra/ssl/" 