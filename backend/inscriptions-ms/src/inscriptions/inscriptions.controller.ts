import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { InscriptionsService } from './inscriptions.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

@Controller()
export class InscriptionsController {
  constructor(private readonly inscriptionsService: InscriptionsService) {}

  @Post()
  create(@Body() createInscriptionDto: CreateInscriptionDto) {
    return this.inscriptionsService.create(createInscriptionDto);
  }

  @Get()
  findAll(@Query() query: { userId?: string; courseId?: string }) {
    return this.inscriptionsService.findAll(query);
  }

  @Delete()
  remove(@Body() deleteBody: { userId: string; courseId: string }) {
    const { userId, courseId } = deleteBody;
    return this.inscriptionsService.remove(userId, courseId);
  }
}
