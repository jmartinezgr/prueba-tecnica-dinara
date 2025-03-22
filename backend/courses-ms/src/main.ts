import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  console.log('Students Microservice is running on port:', envs.port);
}
bootstrap();
