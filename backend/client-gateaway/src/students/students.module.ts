import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, STUDENT_SERVICE } from 'src/config';

@Module({
  controllers: [StudentsController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: STUDENT_SERVICE,
        transport: Transport.TCP,
        options: { host: envs.studentsMsHost, port: envs.studentsMsPort },
      },
    ]),
  ],
})
export class StudentsModule {}
