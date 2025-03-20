import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Listening on port:', envs.port ?? 'no hay');

  // Configurar globalmente los pipes de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades desconocidas
      transform: true, // Convierte los tipos automáticamente (por ejemplo, string a Date)
    }),
  );

  await app.listen(envs.port);
}
bootstrap();
