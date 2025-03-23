import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

@Injectable()
export class InscriptionsService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect();
    console.log('Database Connected');
  }

  async create(createInscriptionDto: CreateInscriptionDto) {
    try {
      return await this.inscription.create({
        data: createInscriptionDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          console.error('❌ Inscripción duplicada.');
          throw new RpcException({
            statusCode: 400,
            message: 'El usuario ya está inscrito en este curso.',
          });
        }
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Error interno en el microservicio.',
      });
    }
  }

  async findAll(filter: { userId?: string; courseId?: string }) {
    try {
      return await this.inscription.findMany({
        where: {
          ...(filter.userId ? { userId: filter.userId } : {}),
          ...(filter.courseId ? { courseId: filter.courseId } : {}),
        },
      });
    } catch (error) {
      console.log(error);
      throw new RpcException({
        statusCode: 500,
        message: 'Error al obtener las inscripciones.',
      });
    }
  }

  async remove(userId: string, courseId: string) {
    try {
      return await this.inscription.delete({
        where: {
          userId_courseId: { userId, courseId }, // Prisma maneja claves compuestas así
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new RpcException({
            statusCode: 404,
            message: 'La inscripción no existe.',
          });
        }
      }
      throw new RpcException({
        statusCode: 500,
        message: 'Error al eliminar la inscripción.',
      });
    }
  }
}
