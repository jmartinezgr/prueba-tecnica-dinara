import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { STUDENT_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('students')
export class StudentsController {
  constructor(
    @Inject(STUDENT_SERVICE) private readonly studentClient: ClientProxy,
  ) {}

  @Post()
  createStudent(@Body() createStudentDto: CreateStudentDto) {
    return 'Creación';
  }

  @Get()
  findAllStudents() {
    return this.studentClient.send({ cmd: 'findStudents' }, {});
  }

  @Get(':id')
  findOneStudent(@Param('id') id: string) {
    return 'Encontrar estudiante por id';
  }

  @Patch(':id')
  updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    return 'actualizar estudiante';
  }

  @Delete(':id')
  removeStudent(@Param('id') id: string) {
    return 'eliminarEstudiante';
  }
}
