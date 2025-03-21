import { Controller, Get } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @MessagePattern({ cmd: 'createStudent' })
  create(@Payload() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @MessagePattern({ cmd: 'findStudents' })
  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @MessagePattern({ cmd: 'findOneStudent' })
  findOne(@Payload('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateStudent' })
  update(@Payload() updateStudentDto: UpdateStudentDto) {
    if (!updateStudentDto.id) {
      throw new RpcException(
        'El ID del estudiante es requerido para actualizar.',
      );
    }
    return this.studentsService.update(updateStudentDto.id, updateStudentDto);
  }

  @MessagePattern({ cmd: 'deleteStudent' })
  remove(@Payload('id') id: string) {
    return this.studentsService.remove(id);
  }
}
