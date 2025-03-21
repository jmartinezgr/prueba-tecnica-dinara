import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main-Gateawat');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si se envían propiedades desconocidas
      transform: true, // Convierte los tipos automáticamente (por ejemplo, string a Date)
    }),
  );
  await app.listen(envs.port);

  logger.log('Client Gateaway is running on port: ', +envs.port);
}
bootstrap();
