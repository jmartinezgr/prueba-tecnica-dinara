import { PrismaService } from './../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudentsService, PrismaService],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();

    // Eliminar posibles datos previos para evitar conflictos
    await prisma.student.deleteMany();
  });

  it('debería crear un estudiante correctamente', async () => {
    const studentData = {
      id: '000000000',
      firstName: 'Juan',
      lastName: 'Pérez',
      gender: 'M',
      personalEmail: 'juan@example.com',
      institutionalEmail: 'juan@school.edu',
      birthDate: new Date('2000-01-01'),
      nationality: 'Colombiana',
    };

    const createdStudent = await service.create(studentData);
    expect(createdStudent).toMatchObject(studentData);
  });

  it('debería lanzar error si el ID ya existe', async () => {
    const studentData = {
      id: '000000000',
      firstName: 'Juan',
      lastName: 'Pérez',
      gender: 'M',
      personalEmail: 'juan@example.com',
      institutionalEmail: 'juan@school.edu',
      birthDate: new Date('2000-01-01'),
      nationality: 'Colombiana',
    };

    await service.create(studentData);

    await expect(service.create(studentData)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('debería obtener todos los estudiantes', async () => {
    await prisma.student.createMany({
      data: [
        {
          id: '000000001',
          firstName: 'Carlos',
          lastName: 'Gómez',
          gender: 'M',
          personalEmail: 'carlos@example.com',
          institutionalEmail: 'carlos@school.edu',
          birthDate: new Date('1999-05-15'),
          nationality: 'Colombiana',
        },
        {
          id: '000000002',
          firstName: 'Ana',
          lastName: 'Martínez',
          gender: 'F',
          personalEmail: 'ana@example.com',
          institutionalEmail: 'ana@school.edu',
          birthDate: new Date('1998-07-20'),
          nationality: 'Colombiana',
        },
      ],
    });

    const students = await service.findAll();
    expect(students).toHaveLength(2);
    expect(students[0]).toHaveProperty('id');
    expect(students[1]).toHaveProperty('id');
  });

  it('debería obtener un estudiante por su ID', async () => {
    const studentData = {
      id: '000000003',
      firstName: 'Luis',
      lastName: 'Ramírez',
      gender: 'M',
      personalEmail: 'luis@example.com',
      institutionalEmail: 'luis@school.edu',
      birthDate: new Date('1997-11-30'),
      nationality: 'Colombiana',
    };

    await prisma.student.create({ data: studentData });

    const student = await service.findOne('000000003');
    expect(student).toMatchObject(studentData);
  });

  it('debería lanzar error si el estudiante no existe', async () => {
    await expect(service.findOne('999999999')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería eliminar un estudiante por su ID', async () => {
    const studentData = {
      id: '000000004',
      firstName: 'María',
      lastName: 'López',
      gender: 'F',
      personalEmail: 'maria@example.com',
      institutionalEmail: 'maria@school.edu',
      birthDate: new Date('2002-03-25'),
      nationality: 'Colombiana',
    };

    await prisma.student.create({ data: studentData });

    await service.remove('000000004');

    const deletedStudent = await prisma.student.findUnique({
      where: { id: '000000004' },
    });

    expect(deletedStudent).toBeNull();
  });

  it('debería lanzar error al intentar eliminar un estudiante que no existe', async () => {
    await expect(service.remove('999999999')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('debería obtener todos los estudiantes', async () => {
    const studentsData = [
      {
        id: '000000000',
        firstName: 'Juan',
        lastName: 'Pérez',
        gender: 'M',
        personalEmail: 'juan@example.com',
        institutionalEmail: 'juan@school.edu',
        birthDate: new Date('2000-01-01'),
        nationality: 'Colombiana',
      },
      {
        id: '000000001',
        firstName: 'Carlos',
        lastName: 'Gómez',
        gender: 'M',
        personalEmail: 'carlos@example.com',
        institutionalEmail: 'carlos@school.edu',
        birthDate: new Date('1999-05-15'),
        nationality: 'Colombiana',
      },
    ];

    // Insertar los estudiantes en la base de datos
    await prisma.student.createMany({
      data: studentsData,
    });

    // Obtener los estudiantes con el servicio
    const students = await service.findAll();
    expect(students).toHaveLength(2);

    // Verificar que todos los estudiantes tengan todas las propiedades esperadas
    students.forEach((student, index) => {
      expect(student).toMatchObject(studentsData[index]);
    });

    // Eliminar los estudiantes creados para limpiar la base de datos
    await prisma.student.deleteMany({
      where: {
        id: {
          in: studentsData.map((s) => s.id),
        },
      },
    });

    // Verificar que se eliminaron correctamente
    const remainingStudents = await service.findAll();
    expect(remainingStudents).toHaveLength(0);
  });
});
