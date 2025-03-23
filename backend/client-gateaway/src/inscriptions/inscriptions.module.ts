import { Module } from '@nestjs/common';
import { InscriptionsController } from './inscriptions.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  envs,
  INSCRIPTION_SERVICE,
  COURSE_SERVICE,
  STUDENT_SERVICE,
} from 'src/config';

@Module({
  controllers: [InscriptionsController],
  imports: [
    ClientsModule.register([
      {
        name: INSCRIPTION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.inscriptionMsHost,
          port: envs.inscriptionMsPort,
        },
      },
      {
        name: COURSE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.coursesMsHost,
          port: envs.coursesMsPort,
        },
      },
      {
        name: STUDENT_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.studentsMsHost,
          port: envs.studentsMsPort,
        },
      },
    ]),
  ],
})
export class InscriptionsModule {}
