import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, COURSE_SERVICE, INSCRIPTION_SERVICE } from 'src/config';

@Module({
  controllers: [CoursesController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: COURSE_SERVICE,
        transport: Transport.TCP,
        options: { host: envs.coursesMsHost, port: envs.coursesMsPort },
      },
    ]),
    ClientsModule.register([
      {
        name: INSCRIPTION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.inscriptionMsHost,
          port: envs.inscriptionMsPort,
        },
      },
    ]),
  ],
})
export class CoursesModule {}
