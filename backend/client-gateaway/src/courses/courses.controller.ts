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
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CourseWithTimestamps, CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { COURSE_SERVICE, INSCRIPTION_SERVICE } from 'src/config';
import { InscriptionWithTimestamps } from 'src/inscriptions/dto/create-inscription.dto';

@Controller('courses')
export class CoursesController {
  constructor(
    @Inject(COURSE_SERVICE) private readonly courseClient: ClientProxy,
    @Inject(INSCRIPTION_SERVICE)
    private readonly inscriptionsClient: ClientProxy,
  ) {}

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    try {
      return await firstValueFrom<CourseWithTimestamps>(
        this.courseClient.send({ cmd: 'createCourse' }, createCourseDto),
      );
    } catch (error: unknown) {
      this.handleRpcError(error, 'Error en la creación del curso');
    }
  }

  @Get()
  findAllCourses() {
    return this.courseClient.send({ cmd: 'findCourses' }, {});
  }

  @Get(':id')
  findOneCourse(@Param('id') id: string) {
    return this.courseClient.send({ cmd: 'findOneCourse' }, { id });
  }

  @Patch(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    try {
      const updatedData = { ...updateCourseDto, id };

      if (updateCourseDto.maxSlots) {
        const inscriptions = await firstValueFrom<InscriptionWithTimestamps[]>(
          this.inscriptionsClient.send(
            { cmd: 'findInscriptions' },
            { courseId: id },
          ),
        );

        if (inscriptions.length > updateCourseDto.maxSlots) {
          throw new HttpException(
            'El número de cupos no puede ser menor a la cantidad de estudiantes inscritos',
            400,
          );
        }
      }

      return await firstValueFrom<CourseWithTimestamps>(
        this.courseClient.send({ cmd: 'updateCourse' }, updatedData),
      );
    } catch (error: unknown) {
      this.handleRpcError(error, 'Error en la actualización del curso');
    }
  }

  @Delete(':id')
  removeCourse(@Param('id') id: string) {
    return this.courseClient.send({ cmd: 'deleteCourse' }, { id });
  }

  private handleRpcError(error: unknown, defaultMessage: string) {
    if (error instanceof RpcException) {
      const errorResponse = error.getError() as {
        message?: string;
        statusCode?: number;
      };
      throw new HttpException(
        errorResponse.message || defaultMessage,
        errorResponse.statusCode || 500,
      );
    }
    if (error && typeof error === 'object' && 'statusCode' in error) {
      const err = error as { message: string; statusCode: number };
      throw new HttpException(err.message, err.statusCode);
    }
    throw new InternalServerErrorException(defaultMessage);
  }
}
