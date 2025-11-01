import { Test, TestingModule } from '@nestjs/testing';
import { PacksService } from './packs.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('PacksService', () => {
  let service: PacksService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    pack: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    player: {
      findMany: jest.fn(),
    },
    playerCard: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaService))
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PacksService>(PacksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('openPack', () => {
    const mockPack = {
      id: 1,
      userId: 1,
      opened: false,
      type: 'NORMAL',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockPlayers = [
      { id: 1, name: 'Player 1' },
      { id: 2, name: 'Player 2' },
      { id: 3, name: 'Player 3' }
    ];

    const mockPlayerCard = {
      id: 1,
      playerId: 1,
      userId: 1,
      rarity: 'COMUN',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    it('should throw NotFoundException if pack is not found', async () => {
      mockPrismaService.pack.findUnique.mockResolvedValueOnce(null);

      await expect(service.openPack(1)).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.pack.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });

    it('should throw error if pack is already opened', async () => {
      mockPrismaService.pack.findUnique.mockResolvedValueOnce({
        ...mockPack,
        opened: true
      });

      await expect(service.openPack(1)).rejects.toThrow('El pack ya ha sido abierto');
    });

    it('should throw error if no players are available', async () => {
      mockPrismaService.pack.findUnique.mockResolvedValueOnce(mockPack);
      mockPrismaService.player.findMany.mockResolvedValueOnce([]);

      await expect(service.openPack(1)).rejects.toThrow('No hay jugadores disponibles');
    });

    it('should successfully open a pack and create cards', async () => {
      mockPrismaService.pack.findUnique.mockResolvedValueOnce(mockPack);
      mockPrismaService.player.findMany.mockResolvedValueOnce(mockPlayers);
      mockPrismaService.playerCard.create.mockResolvedValue(mockPlayerCard);
      mockPrismaService.pack.update.mockResolvedValueOnce({ ...mockPack, opened: true });

      const result = await service.openPack(1);

      expect(result).toHaveLength(3);
      expect(mockPrismaService.pack.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { opened: true }
      });
      expect(mockPrismaService.playerCard.create).toHaveBeenCalledTimes(3);
      result.forEach(card => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('playerId');
        expect(card).toHaveProperty('userId', mockPack.userId);
        expect(card).toHaveProperty('rarity');
      });
    });
  });
});