import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @MessagePattern({ cmd: 'createCourse' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  create(@Payload() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(createCourseDto);
  }

  @MessagePattern({ cmd: 'findCourses' })
  findAll() {
    return this.coursesService.findAll();
  }

  @MessagePattern({ cmd: 'findOneCourse' })
  findOne(@Payload('id') id: string) {
    return this.coursesService.findOne(id);
  }

  @MessagePattern({ cmd: 'updateCourse' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  update(@Payload() updateCourseDto: UpdateCourseDto) {
    if (!updateCourseDto.id) {
      throw new RpcException('El ID del curso es requerido para actualizar.');
    }
    return this.coursesService.update(updateCourseDto.id, updateCourseDto);
  }

  @MessagePattern({ cmd: 'deleteCourse' })
  remove(@Payload('id') id: string) {
    return this.coursesService.remove(id);
  }
}
