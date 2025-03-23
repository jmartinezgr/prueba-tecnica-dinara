/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';

describe('CoursesService', () => {
  let service: CoursesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoursesService, PrismaService],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    await prisma.course.deleteMany();
  });

  afterEach(async () => {
    await prisma.course.deleteMany();
  });

  it('debería crear un curso correctamente', async () => {
    const courseData = {
      id: 'course-001',
      name: 'Matemáticas',
      professor: 'Dr. Rodríguez',
      maxSlots: 30,
      enrolledStudents: 0, // ✅ Agregado
    };

    const createdCourse = await service.create(courseData);
    expect(createdCourse).toMatchObject(courseData);
  });

  it('debería lanzar error si el nombre del curso ya existe', async () => {
    const courseData = {
      id: 'course-002',
      name: 'Historia',
      professor: 'Prof. Gómez',
      maxSlots: 25,
      enrolledStudents: 0, // ✅ Agregado
    };

    await service.create(courseData);
    await expect(service.create(courseData)).rejects.toThrow(RpcException);
  });

  it('debería actualizar un curso correctamente', async () => {
    const course = await prisma.course.create({
      data: {
        id: 'course-003',
        name: 'Física',
        professor: 'Ing. Pérez',
        maxSlots: 40,
        enrolledStudents: 0, // ✅ Agregado
      },
    });

    const updatedCourse = await service.update('course-003', {
      id: 'course-003', // ✅ Agregado
      name: 'Física Avanzada',
    });

    expect(updatedCourse.name).toBe('Física Avanzada');
  });

  it('debería lanzar error al intentar actualizar a un nombre que ya existe', async () => {
    await prisma.course.createMany({
      data: [
        {
          id: 'course-004',
          name: 'Química',
          professor: 'Dra. Herrera',
          maxSlots: 35,
          enrolledStudents: 0, // ✅ Agregado
        },
        {
          id: 'course-005',
          name: 'Biología',
          professor: 'Dr. Ruiz',
          maxSlots: 20,
          enrolledStudents: 0, // ✅ Agregado
        },
      ],
    });

    await expect(
      service.update('course-004', { id: 'course-004', name: 'Biología' }), // ✅ Agregado `id`
    ).rejects.toThrow(RpcException);
  });

  it('debería lanzar error si intenta actualizar un curso que no existe', async () => {
    await expect(
      service.update('course-999', { id: 'course-999', name: 'Nuevo Curso' }), // ✅ Agregado `id`
    ).rejects.toThrow(RpcException);
  });

  it('debería obtener todos los cursos', async () => {
    await prisma.course.createMany({
      data: [
        {
          id: 'course-006',
          name: 'Arte',
          professor: 'Prof. Sánchez',
          maxSlots: 15,
          enrolledStudents: 0, // ✅ Agregado
        },
        {
          id: 'course-007',
          name: 'Música',
          professor: 'Prof. López',
          maxSlots: 20,
          enrolledStudents: 0, // ✅ Agregado
        },
      ],
    });

    const courses = await service.findAll();
    expect(courses).toHaveLength(2);
  });

  it('debería obtener un curso por su ID', async () => {
    const courseData = {
      id: 'course-008',
      name: 'Educación Física',
      professor: 'Coach Fernández',
      maxSlots: 50,
      enrolledStudents: 0, // ✅ Agregado
    };

    await prisma.course.create({ data: courseData });
    const course = await service.findOne('course-008');
    expect(course).toMatchObject(courseData);
  });

  it('debería lanzar error si el curso no existe', async () => {
    await expect(service.findOne('course-999')).rejects.toThrow(RpcException);
  });

  it('debería eliminar un curso por su ID', async () => {
    const courseData = {
      id: 'course-009',
      name: 'Geografía',
      professor: 'Prof. Ortega',
      maxSlots: 25,
      enrolledStudents: 0, // ✅ Agregado
    };

    await prisma.course.create({ data: courseData });

    await service.remove('course-009');

    const deletedCourse = await prisma.course.findUnique({
      where: { id: 'course-009' },
    });

    expect(deletedCourse).toBeNull();
  });

  it('debería lanzar error al intentar eliminar un curso que no existe', async () => {
    await expect(service.remove('course-999')).rejects.toThrow(RpcException);
  });
});
