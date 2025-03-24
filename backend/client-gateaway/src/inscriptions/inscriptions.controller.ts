import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Inject,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import {
  INSCRIPTION_SERVICE,
  COURSE_SERVICE,
  STUDENT_SERVICE,
} from 'src/config';

@Controller('inscriptions')
export class InscriptionsController {
  constructor(
    @Inject(INSCRIPTION_SERVICE)
    private readonly inscriptionsClient: ClientProxy,
    @Inject(COURSE_SERVICE) private readonly courseClient: ClientProxy,
    @Inject(STUDENT_SERVICE) private readonly studentClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createInscriptionDto: CreateInscriptionDto) {
    const { userId, courseId } = createInscriptionDto;
    try {
      // Verificar si el estudiante existe
      const student = await firstValueFrom(
        this.studentClient.send({ cmd: 'findOneStudent' }, { id: userId }),
      );
      if (!student) {
        throw new HttpException('El estudiante no existe', 404);
      }

      // Verificar si el curso existe y si hay cupo disponible
      const course = await firstValueFrom(
        this.courseClient.send({ cmd: 'findOneCourse' }, { id: courseId }),
      );
      if (!course) {
        throw new HttpException('El curso no existe', 404);
      }
      if (course.enrolledStudents >= course.maxSlots) {
        throw new HttpException('No hay cupo en el curso', 400);
      }

      // Crear la inscripción si las verificaciones pasaron
      return await firstValueFrom(
        this.inscriptionsClient.send(
          { cmd: 'createInscription' },
          createInscriptionDto,
        ),
      );
    } catch (error) {
      this.handleRpcError(error, 'Error al inscribir al estudiante');
    }
  }

  @Get()
  async findAll(@Query() query: { userId?: string; courseId?: string }) {
    try {
      // Obtener las inscripciones basadas en el userId o courseId
      const inscriptions = await firstValueFrom(
        this.inscriptionsClient.send({ cmd: 'findInscriptions' }, query),
      );

      console.log(inscriptions);

      // Si no hay inscripciones, devolver un array vacío
      if (!inscriptions || inscriptions.length === 0) {
        return [];
      }

      // Verificar la existencia de cursos y estudiantes
      const validInscriptions = await Promise.all(
        inscriptions.map(
          async (inscription: { userId: string; courseId: string }) => {
            try {
              // Verificar si el curso existe
              const course = await firstValueFrom(
                this.courseClient.send(
                  { cmd: 'findOneCourse' },
                  { id: inscription.courseId },
                ),
              );

              // Si el curso no existe, eliminar la inscripción
              if (course.status === 'error') {
                console.warn(
                  `Curso no encontrado: ${inscription.courseId}. Eliminando inscripción.`,
                );
                await firstValueFrom(
                  this.inscriptionsClient.send(
                    { cmd: 'deleteInscription' },
                    {
                      userId: inscription.userId,
                      courseId: inscription.courseId,
                    },
                  ),
                );
                return null;
              }

              // Verificar si el estudiante existe
              const student = await firstValueFrom(
                this.studentClient.send(
                  { cmd: 'findOneStudent' },
                  { id: inscription.userId },
                ),
              );

              // Si el estudiante no existe, eliminar la inscripción
              if (student.status === 'error') {
                console.warn(
                  `Estudiante no encontrado: ${inscription.userId}. Eliminando inscripción.`,
                );
                await firstValueFrom(
                  this.inscriptionsClient.send(
                    { cmd: 'deleteInscription' },
                    {
                      userId: inscription.userId,
                      courseId: inscription.courseId,
                    },
                  ),
                );
                return null;
              }

              // Si ambos existen, devolver la inscripción
              return {
                userId: inscription.userId,
                courseId: inscription.courseId,
                courseDetails: course,
              };
            } catch (error) {
              console.error(`Error al verificar la inscripción:`, error);
              return null;
            }
          },
        ),
      );

      // Filtrar las inscripciones válidas
      const result = validInscriptions.filter(Boolean);

      // Lógica basada en los parámetros
      if (query.userId && query.courseId) {
        // Si se proporcionan ambos, devolver el registro específico o null
        return result.length > 0 ? result[0] : null;
      } else {
        // Si solo se proporciona userId o courseId, devolver todos los registros válidos
        return result;
      }
    } catch (error) {
      this.handleRpcError(error, 'Error al obtener las inscripciones');
    }
  }

  @Delete()
  remove(@Body() deleteBody: { userId: string; courseId: string }) {
    return this.inscriptionsClient.send(
      { cmd: 'deleteInscription' },
      deleteBody,
    );
  }

  private handleRpcError(error: unknown, defaultMessage: string) {
    console.log(error);
    // Caso 1: Si el error es una RpcException con objeto de error
    if (error instanceof RpcException) {
      const errorResponse = error.getError();
      if (typeof errorResponse === 'object' && errorResponse !== null) {
        const { message, statusCode } = errorResponse as {
          message?: string;
          statusCode?: number;
        };
        throw new HttpException(message || defaultMessage, statusCode || 500);
      }
      throw new HttpException(defaultMessage, 500);
    }

    // Caso 2: Si el error ya tiene `response` con `status` (Ej: error de microservicio)
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response === 'string' &&
      'status' in error
    ) {
      const err = error as { response: string; status: number };
      throw new HttpException(err.response, err.status);
    }

    // Caso 3: Si el error ya tiene `statusCode` y `message` (Ej: error HTTP normal)
    if (
      typeof error === 'object' &&
      error !== null &&
      'statusCode' in error &&
      'message' in error
    ) {
      const err = error as { message: string; statusCode: number };
      throw new HttpException(err.message, err.statusCode);
    }

    // Caso 4: Si el error es un string (por si acaso)
    if (typeof error === 'string') {
      throw new HttpException(error, 500);
    }

    // Caso 5: Si no es un error reconocible, lanzar una excepción interna
    throw new InternalServerErrorException(defaultMessage);
  }
}
