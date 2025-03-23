-- Crear la base de datos si no existe
SELECT 'CREATE DATABASE courses;' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'courses')\gexec

-- Conectarse a la base de datos
\c courses

-- Crear la tabla si no existe
CREATE TABLE IF NOT EXISTS "Course" (
  id TEXT PRIMARY KEY, -- Identificador único del curso
  name TEXT NOT NULL, -- Nombre del curso
  professor TEXT NOT NULL, -- Nombre del profesor
  maxSlots INT NOT NULL, -- Número máximo de cupos
  enrolledStudents INT DEFAULT 0, -- Número de estudiantes matriculados
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

DROP TRIGGER IF EXISTS trigger_updated_at ON "Course";

CREATE TRIGGER trigger_updated_at
BEFORE UPDATE ON "Course"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
