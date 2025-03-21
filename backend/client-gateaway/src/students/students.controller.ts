import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { STUDENT_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('students')
export class StudentsController {
  constructor(
    @Inject(STUDENT_SERVICE) private readonly studentClient: ClientProxy,
  ) {}

  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    console.log('🛠 Enviando datos:', createStudentDto);
    try {
      return await firstValueFrom<CreateStudentDto>(
        this.studentClient.send({ cmd: 'createStudent' }, createStudentDto),
      );
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        // RpcException tiene un método `.getError()` para obtener detalles
        const errorResponse = error.getError() as {
          message?: string;
          statusCode?: number;
        };
        throw new HttpException(
          errorResponse.message || 'Error desconocido',
          errorResponse.statusCode || 500,
        );
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        const err = error as { message: string; statusCode: number };
        throw new HttpException(err.message, err.statusCode);
      }

      throw new InternalServerErrorException(
        'Error en la creación del estudiante',
      );
    }
  }

  @Get()
  findAllStudents() {
    return this.studentClient.send({ cmd: 'findStudents' }, {});
  }

  @Get(':id')
  findOneStudent(@Param('id') id: string) {
    return this.studentClient.send({ cmd: 'findOneStudent' }, { id });
  }
  @Patch(':id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    try {
      return await firstValueFrom<CreateStudentDto>(
        this.studentClient.send(
          { cmd: 'updateStudent' },
          { id, data: updateStudentDto },
        ),
      );
    } catch (error: unknown) {
      if (error instanceof RpcException) {
        const errorResponse = error.getError() as {
          message?: string;
          statusCode?: number;
        };
        throw new HttpException(
          errorResponse.message || 'Error desconocido',
          errorResponse.statusCode || 500,
        );
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        const err = error as { message: string; statusCode: number };
        throw new HttpException(err.message, err.statusCode);
      }

      throw new InternalServerErrorException(
        'Error en la actualización del estudiante',
      );
    }
  }

  @Delete(':id')
  removeStudent(@Param('id') id: string) {
    return this.studentClient.send({ cmd: 'deleteStudent' }, { id });
  }
}
