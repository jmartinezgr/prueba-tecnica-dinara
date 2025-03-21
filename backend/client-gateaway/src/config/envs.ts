import * as Joi from 'joi';
import * as dotenv from 'dotenv';

// Cargar variables del archivo .env si no están en process.env
dotenv.config();

interface EnvVars {
  PORT: number;
  STUDENT_SERVICE_HOST: string;
  STUDENT_SERVICE_PORT: number;
}

// Definir el esquema de validación
const envsSchema = Joi.object<EnvVars>({
  PORT: Joi.number().default(3000),
  STUDENT_SERVICE_HOST: Joi.string().required(),
  STUDENT_SERVICE_PORT: Joi.number().required(),
}).unknown(true); // Permite variables adicionales en `process.env`

// Validar las variables de entorno
const validationResult = envsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(`Config validation error: ${validationResult.error.message}`);
}

// Extraer los valores validados
const envVars: EnvVars = validationResult.value;

export const envs = {
  port: envVars.PORT,
  studentsMsHost: envVars.STUDENT_SERVICE_HOST,
  studentsMsPort: envVars.STUDENT_SERVICE_PORT,
};
