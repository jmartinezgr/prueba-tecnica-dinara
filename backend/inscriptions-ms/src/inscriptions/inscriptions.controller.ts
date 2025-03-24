import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @MessagePattern({ cmd: 'createInscription' })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  create(@Payload() createInscriptionDto: CreateInscriptionDto) {
    return this.inscriptionsService.create(createInscriptionDto);
  }

  @MessagePattern({ cmd: 'findInscriptions' })
  findAll(@Payload() query: { userId?: string; courseId?: string }) {
    return this.inscriptionsService.findAll(query);
  }

  @MessagePattern({ cmd: 'findOneInscription' })
  findOneInscription(@Payload() filter: { userId: string; courseId: string }) {
    return this.inscriptionsService.findOneInscription(filter);
  }

  @MessagePattern({ cmd: 'deleteInscription' })
  remove(@Payload() deleteBody: { userId: string; courseId: string }) {
    if (!deleteBody.userId || !deleteBody.courseId) {
      throw new RpcException(
        'userId y courseId son requeridos para eliminar una inscripción.',
      );
    }
    return this.inscriptionsService.remove(
      deleteBody.userId,
      deleteBody.courseId,
    );
  }
}
