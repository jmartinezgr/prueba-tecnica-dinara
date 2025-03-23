-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE inscriptions;' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'inscriptions')\gexec

-- Conectarse a la base de datos
\c inscriptions

-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS "Inscription" (
  userId TEXT NOT NULL,
  courseId TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, courseId)
);
