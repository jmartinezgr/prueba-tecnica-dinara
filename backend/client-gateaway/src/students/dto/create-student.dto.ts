/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  IsString,
  IsOptional,
  IsEmail,
  IsNotEmpty,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  id: string; // Cédula del estudiante (ID)

  @IsString()
  @IsNotEmpty()
  firstName: string;
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsOptional()
  @IsString()
  documentDepartment?: string;

  @IsOptional()
  @IsString()
  documentPlace?: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsOptional()
  @IsString()
  ethnicity?: string;

  @Transform(({ value }) => String(value))
  @IsEmail()
  personalEmail: string;

  @Transform(({ value }) => String(value))
  @IsEmail()
  institutionalEmail: string;
  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @IsOptional()
  @IsString()
  landlinePhone?: string;

  @Transform(({ value }) => new Date(value))
  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  @IsString()
  @IsNotEmpty()
  nationality: string;
}
