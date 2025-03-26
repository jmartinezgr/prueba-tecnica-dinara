import { IsString, IsNotEmpty, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  professor: string;

  @IsInt()
  @Min(1)
  maxSlots: number;

  @IsInt()
  @Min(0)
  enrolledStudents: number = 0;
}

export type CourseWithTimestamps = CreateCourseDto & {
  createdAt: string;
  updatedAt: string;
};
