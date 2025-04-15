#!/bin/bash

# Verificar si la variable de entorno DATABASE_URL está definida
if [ -z "$DATABASE_URL" ]; then
  echo "Error: La variable de entorno DATABASE_URL no está definida"
  exit 1
fi

# Asegurar que la URL de conexión use sslmode=require
if [[ "$DATABASE_URL" == *"?"* ]]; then
  # Si ya tiene parámetros, agregar &sslmode=require
  CONNECTION_URL="${DATABASE_URL}&sslmode=require"
else
  # Si no tiene parámetros, agregar ?sslmode=require
  CONNECTION_URL="${DATABASE_URL}?sslmode=require"
fi

# Intentar conectar a la base de datos
echo "Intentando conectar a la base de datos..."
if psql "$CONNECTION_URL" -c "SELECT 1;" > /dev/null 2>&1; then
  echo "✅ Conexión exitosa a la base de datos"
  exit 0
else
  echo "❌ Error al conectar a la base de datos"
  exit 1
fi 