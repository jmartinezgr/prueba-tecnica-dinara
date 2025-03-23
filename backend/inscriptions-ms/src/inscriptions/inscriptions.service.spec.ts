import { Test, TestingModule } from '@nestjs/testing';
import { InscriptionsService } from './inscriptions.service';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../../prisma/prisma.service';

describe('InscriptionsService', () => {
  let service: InscriptionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InscriptionsService, PrismaService],
    }).compile();

    service = module.get<InscriptionsService>(InscriptionsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
    await prisma.inscription.deleteMany();
  });

  afterEach(async () => {
    await prisma.inscription.deleteMany();
  });

  it('debería crear una inscripción correctamente', async () => {
    const inscriptionData = { userId: 'user-001', courseId: 'course-001' };
    const createdInscription = await service.create(inscriptionData);
    expect(createdInscription).toMatchObject(inscriptionData);
  });

  it('debería lanzar error si el usuario ya está inscrito en el curso', async () => {
    const inscriptionData = { userId: 'user-002', courseId: 'course-002' };
    await service.create(inscriptionData);
    await expect(service.create(inscriptionData)).rejects.toThrow(RpcException);
  });

  it('debería obtener todas las inscripciones', async () => {
    await prisma.inscription.createMany({
      data: [
        { userId: 'user-003', courseId: 'course-003' },
        { userId: 'user-004', courseId: 'course-004' },
      ],
    });
    const inscriptions = await service.findAll({});
    expect(inscriptions).toHaveLength(2);
  });

  it('debería obtener inscripciones filtradas por userId', async () => {
    await prisma.inscription.createMany({
      data: [
        { userId: 'user-005', courseId: 'course-005' },
        { userId: 'user-005', courseId: 'course-006' },
      ],
    });
    const inscriptions = await service.findAll({ userId: 'user-005' });
    expect(inscriptions).toHaveLength(2);
  });

  it('debería obtener inscripciones filtradas por courseId', async () => {
    await prisma.inscription.createMany({
      data: [
        { userId: 'user-006', courseId: 'course-007' },
        { userId: 'user-007', courseId: 'course-007' },
      ],
    });
    const inscriptions = await service.findAll({ courseId: 'course-007' });
    expect(inscriptions).toHaveLength(2);
  });

  it('debería eliminar una inscripción correctamente', async () => {
    const inscriptionData = { userId: 'user-008', courseId: 'course-008' };
    await prisma.inscription.create({ data: inscriptionData });
    await service.remove('user-008', 'course-008');
    const deletedInscription = await prisma.inscription.findUnique({
      where: {
        userId_courseId: { userId: 'user-008', courseId: 'course-008' },
      },
    });
    expect(deletedInscription).toBeNull();
  });

  it('debería lanzar error si intenta eliminar una inscripción inexistente', async () => {
    await expect(service.remove('user-999', 'course-999')).rejects.toThrow(
      RpcException,
    );
  });
});
