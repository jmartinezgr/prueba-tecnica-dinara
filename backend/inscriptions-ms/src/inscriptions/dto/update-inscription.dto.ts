import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateInscriptionDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}
