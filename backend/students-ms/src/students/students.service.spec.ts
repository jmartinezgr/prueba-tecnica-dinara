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
    await prisma.student.deleteMany();
  });

  afterEach(async () => {
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

  it('debería actualizar un estudiante correctamente', async () => {
    const studentData = await prisma.student.create({
      data: {
        id: '000000005',
        firstName: 'Pedro',
        lastName: 'González',
        gender: 'M',
        personalEmail: 'pedro@example.com',
        institutionalEmail: 'pedro@school.edu',
        birthDate: new Date('1998-08-08'),
        nationality: 'Colombiana',
      },
    });

    const updatedData = await service.update('000000005', {
      firstName: 'Pedro Modificado',
    });
    expect(updatedData.firstName).toBe('Pedro Modificado');
  });

  it('debería lanzar error al intentar actualizar con un campo inválido', async () => {
    const studentData = await prisma.student.create({
      data: {
        id: '000000006',
        firstName: 'Elena',
        lastName: 'Rodríguez',
        gender: 'F',
        personalEmail: 'elena@example.com',
        institutionalEmail: 'elena@school.edu',
        birthDate: new Date('2001-02-14'),
        nationality: 'Colombiana',
      },
    });

    await expect(
      service.update('000000006', {
        invalidField: 'Valor no permitido',
      } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar error al intentar actualizar con un tipo de dato incorrecto', async () => {
    const studentData = await prisma.student.create({
      data: {
        id: '000000007',
        firstName: 'Sofía',
        lastName: 'Fernández',
        gender: 'F',
        personalEmail: 'sofia@example.com',
        institutionalEmail: 'sofia@school.edu',
        birthDate: new Date('1995-06-30'),
        nationality: 'Colombiana',
      },
    });

    await expect(
      service.update('000000007', {
        birthDate: 'fecha-invalida' as unknown as Date,
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('debería lanzar error si intenta actualizar un estudiante que no existe', async () => {
    await expect(
      service.update('999999999', { firstName: 'Nombre Inexistente' }),
    ).rejects.toThrow(NotFoundException);
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
