import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends OmitType(PartialType(CreateCourseDto), [
  'id',
] as const) {}
