import { Test, TestingModule } from '@nestjs/testing';
import { MazoService } from './mazo.service';
import { PrismaService } from '../prisma/prisma.service';

describe('Servicio de Mazos', () => {
  let servicio: MazoService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    mazo: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MazoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    servicio = module.get<MazoService>(MazoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('debería estar definido', () => {
    expect(servicio).toBeDefined();
  });

  describe('obtenerTodos', () => {
    it('debería devolver un array de mazos', async () => {
      const mazosMock = [
        {
          id: 1,
          nombre: 'Mazo de Prueba 1',
          usuarioId: 1,
        },
        {
          id: 2,
          nombre: 'Mazo de Prueba 2',
          usuarioId: 1,
        },
      ];

      mockPrismaService.mazo.findMany.mockResolvedValue(mazosMock);

      const resultado = await servicio.findAll();

      expect(resultado).toEqual(mazosMock);
      expect(prismaService.mazo.findMany).toHaveBeenCalled();
    });
  });

  describe('obtenerUno', () => {
    it('debería devolver un único mazo', async () => {
      const mazoMock = {
        id: 1,
        nombre: 'Mazo de Prueba',
        usuarioId: 1,
      };

      mockPrismaService.mazo.findUnique.mockResolvedValue(mazoMock);

      const resultado = await servicio.findOne(1);

      expect(resultado).toEqual(mazoMock);
      expect(prismaService.mazo.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('debería devolver null si el mazo no existe', async () => {
      mockPrismaService.mazo.findUnique.mockResolvedValue(null);

      const resultado = await servicio.findOne(999);

      expect(resultado).toBeNull();
    });
  });

  describe('crear', () => {
    it('debería crear un nuevo mazo', async () => {
      const mazoNuevo = {
        nombre: 'Nuevo Mazo',
        usuarioId: 1,
      };

      const mazoCreado = {
        id: 1,
        ...mazoNuevo,
      };

      mockPrismaService.mazo.create.mockResolvedValue(mazoCreado);

      const resultado = await servicio.create(mazoNuevo);

      expect(resultado).toEqual(mazoCreado);
      expect(prismaService.mazo.create).toHaveBeenCalledWith({
        data: mazoNuevo,
      });
    });
  });
});