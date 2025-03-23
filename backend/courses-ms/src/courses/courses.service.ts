/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaClient, Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CoursesService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Database Connected');
  }

  async create(createCourseDto: CreateCourseDto) {
    try {
      return (await this.course.create({
        data: createCourseDto,
      })) as CreateCourseDto;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new RpcException({
            statusCode: 400,
            message: `El nombre del curso '${createCourseDto.name}' ya está en uso.`,
          });
        }
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Error interno en el microservicio.',
      });
    }
  }

  findAll() {
    return this.course.findMany();
  }

  async findOne(id: string) {
    const course = await this.course.findUnique({
      where: { id },
    });
    if (!course) {
      throw new RpcException(`No se encontró el curso con ID: ${id}`);
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const existingCourse = await this.course.findUnique({ where: { id } });
      if (!existingCourse) {
        throw new RpcException(`No se encontró el curso con ID: ${id}`);
      }

      if (updateCourseDto.name) {
        const nameExists = await this.course.findUnique({
          where: { name: updateCourseDto.name },
        });
        if (nameExists && nameExists.id !== id) {
          throw new RpcException({
            statusCode: 400,
            message: `El nombre del curso '${updateCourseDto.name}' ya está en uso.`,
          });
        }
      }

      return await this.course.update({
        where: { id },
        data: updateCourseDto,
      });
    } catch (error) {
      throw new RpcException('Error al actualizar el curso.');
    }
  }

  async remove(id: string) {
    try {
      return await this.course.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RpcException(`No se encontró el curso con ID: ${id}`);
        }
      }
      throw new RpcException('Error al eliminar el curso.');
    }
  }
}
