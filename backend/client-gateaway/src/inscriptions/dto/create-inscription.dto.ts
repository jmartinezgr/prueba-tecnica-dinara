import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInscriptionDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;
}
