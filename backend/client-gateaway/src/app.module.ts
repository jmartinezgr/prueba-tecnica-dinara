import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [StudentsModule, CoursesModule],
})
export class AppModule {}
