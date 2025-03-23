import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionsController } from './inscriptions/inscriptions.controller';
import { ClientProxy } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';

describe('InscriptionsController', () => {
  let controller: InscriptionsController;
  let inscriptionsClient: ClientProxy;
  let courseClient: ClientProxy;
  let studentClient: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InscriptionsController],
      providers: [
        {
          provide: 'INSCRIPTION_SERVICE',
          useValue: { send: jest.fn() },
        },
        {
          provide: 'COURSE_SERVICE',
          useValue: { send: jest.fn() },
        },
        {
          provide: 'STUDENT_SERVICE',
          useValue: { send: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<InscriptionsController>(InscriptionsController);
    inscriptionsClient = module.get<ClientProxy>('INSCRIPTION_SERVICE');
    courseClient = module.get<ClientProxy>('COURSE_SERVICE');
    studentClient = module.get<ClientProxy>('STUDENT_SERVICE');
  });

  it('Debe permitir la inscripción en un curso con cupos disponibles', async () => {
    const student = { id: '123', firstName: 'Juan', lastName: 'Pérez' };
    const course = { id: 'abc', maxSlots: 10, enrolledStudents: 5 };

    jest.spyOn(studentClient, 'send').mockImplementation(() => of(student));
    jest.spyOn(courseClient, 'send').mockImplementation(() => of(course));
    jest
      .spyOn(inscriptionsClient, 'send')
      .mockImplementation(() => of({ success: true }));

    const result = await controller.create({ userId: '123', courseId: 'abc' });
    expect(result).toEqual({ success: true });
  });

  it('Debe rechazar la inscripción en un curso sin cupos disponibles', async () => {
    const student = { id: '123', firstName: 'Juan', lastName: 'Pérez' };
    const course = { id: 'abc', maxSlots: 5, enrolledStudents: 5 };

    jest.spyOn(studentClient, 'send').mockImplementation(() => of(student));
    jest.spyOn(courseClient, 'send').mockImplementation(() => of(course));

    await expect(
      controller.create({ userId: '123', courseId: 'abc' }),
    ).rejects.toThrow('No hay cupo en el curso');
  });

  it('Debe rechazar la inscripción de un estudiante inexistente', async () => {
    jest.spyOn(studentClient, 'send').mockImplementation(() => of(null));

    await expect(
      controller.create({ userId: '999', courseId: 'abc' }),
    ).rejects.toThrow('El estudiante no existe');
  });

  it('Debe rechazar la inscripción en un curso inexistente', async () => {
    const student = { id: '123', firstName: 'Juan', lastName: 'Pérez' };

    jest.spyOn(studentClient, 'send').mockImplementation(() => of(student));
    jest.spyOn(courseClient, 'send').mockImplementation(() => of(null));

    await expect(
      controller.create({ userId: '123', courseId: 'xyz' }),
    ).rejects.toThrow('El curso no existe');
  });

  it('Debe rechazar la inscripción doble en el mismo curso', async () => {
    const student = { id: '123', firstName: 'Juan', lastName: 'Pérez' };
    const course = { id: 'abc', maxSlots: 10, enrolledStudents: 5 };

    jest.spyOn(studentClient, 'send').mockImplementation(() => of(student));
    jest.spyOn(courseClient, 'send').mockImplementation(() => of(course));
    jest
      .spyOn(inscriptionsClient, 'send')
      .mockImplementation(() =>
        throwError(() => new Error('Estudiante ya inscrito')),
      );

    await expect(
      controller.create({ userId: '123', courseId: 'abc' }),
    ).rejects.toThrow('Estudiante ya inscrito');
  });
});
