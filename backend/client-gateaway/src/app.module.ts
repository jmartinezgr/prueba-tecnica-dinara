import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module';
import { CoursesModule } from './courses/courses.module';
import { InscriptionsModule } from './inscriptions/inscriptions.module';

@Module({
  imports: [StudentsModule, CoursesModule, InscriptionsModule],
})
export class AppModule {}
