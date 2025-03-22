-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE students;' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'students')\gexec

-- Conectarse a la base de datos
\c students

-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS "Student" (
  id TEXT PRIMARY KEY, -- La cédula como ID
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  documentDepartment TEXT,
  documentPlace TEXT,
  gender TEXT NOT NULL,
  ethnicity TEXT,
  personalEmail TEXT UNIQUE NOT NULL,
  institutionalEmail TEXT UNIQUE NOT NULL,
  mobilePhone TEXT,
  landlinePhone TEXT,
  birthDate TIMESTAMP NOT NULL,
  nationality TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear un trigger para actualizar "updatedAt" automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_updated_at ON "Student";

CREATE TRIGGER trigger_updated_at
BEFORE UPDATE ON "Student"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();