import * as Joi from 'joi';

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = Joi.object<EnvVars>({
  PORT: Joi.number().required(),
  DATABASE_URL: Joi.string().required(),
}).unknown(true); // Permite variables adicionales en `process.env`

const validationResult = envsSchema.validate(process.env);

if (validationResult.error) {
  throw new Error(`Config validation error: ${validationResult.error.message}`);
}

// Se extraen los valores correctamente tipados
const envVars: EnvVars = validationResult.value;

export const envs = {
  port: envVars.PORT,
  databaseUrl: envVars.DATABASE_URL,
};
