import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Controller()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @MessagePattern('createStudent')
  create(@Payload() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @MessagePattern('findAllStudents')
  findAll() {
    return this.studentsService.findAll();
  }

  @MessagePattern('findOneStudent')
  findOne(@Payload() id: number) {
    return this.studentsService.findOne(id);
  }

  @MessagePattern('updateStudent')
  update(@Payload() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(updateStudentDto.id, updateStudentDto);
  }

  @MessagePattern('removeStudent')
  remove(@Payload() id: number) {
    return this.studentsService.remove(id);
  }
}
