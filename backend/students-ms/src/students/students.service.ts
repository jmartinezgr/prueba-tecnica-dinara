import {
  BadRequestException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class StudentsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Database Connected');
  }
  async create(createStudentDto: CreateStudentDto) {
    try {
      return await this.student.create({
        data: createStudentDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const field =
            (error.meta?.target as string[])?.join(', ') || 'desconocido';
          console.error(`❌ Error de unicidad en: ${field}`);
          throw new BadRequestException(`El campo ${field} ya está en uso.`);
        }
      }
      throw error;
    }
  }

  findAll() {
    return this.student.findMany();
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    try {
      const { id: __, ...updateData } = updateStudentDto;

      return await this.student.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `No se encontró el estudiante con ID: ${id}`,
          );
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        throw new BadRequestException('Datos inválidos en la actualización.');
      }
      throw error;
    }
  }

  async findOne(id: string) {
    const student = await this.student.findUnique({ where: { id } });
    if (!student) {
      throw new NotFoundException(`No se encontró el estudiante con ID: ${id}`);
    }
    return student;
  }

  async remove(id: string) {
    try {
      return await this.student.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            `No se encontró el estudiante con ID: ${id}`,
          );
        }
      }
      throw error;
    }
  }
}
