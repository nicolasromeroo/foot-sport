import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type Rarity = 'COMUN' | 'RARA' | 'EPICA';

@Injectable()
export class PacksService {
  constructor(private prisma: PrismaService) {}

  private determinarRareza(): Rarity {
    const random = Math.random();
    if (random < 0.6) return 'COMUN';
    if (random < 0.85) return 'RARA';
    return 'EPICA';
  }

  async openPack(packId: number) {
    const pack = await this.prisma.pack.findUnique({
      where: { id: packId }
    });

    if (!pack) {
      throw new NotFoundException('Pack no encontrado');
    }

    if (pack.opened) {
      throw new Error('El pack ya ha sido abierto');
    }

    // Obtener jugadores disponibles
    const jugadores = await this.prisma.player.findMany();
    
    if (!jugadores || !jugadores.length) {
      throw new Error('No hay jugadores disponibles');
    }

    // Generar 3 cartas aleatorias
    const cartasGeneradas: Array<{ playerId: number; rarity: Rarity }> = [];
    for (let i = 0; i < 3; i++) {
      const jugador = jugadores[Math.floor(Math.random() * jugadores.length)];
      if (!jugador || !jugador.id) {
        throw new Error('Jugador inválido encontrado');
      }
      cartasGeneradas.push({
        playerId: jugador.id,
        rarity: this.determinarRareza()
      });
    }

    // Crear las cartas en la base de datos usando una transacción
    const cartasCreadas = await this.prisma.$transaction(async (prisma) => {
      // Crear las cartas
      const cartas = await Promise.all(
        cartasGeneradas.map(carta => 
          prisma.playerCard.create({
            data: {
              playerId: carta.playerId,
              userId: pack.userId,
              rarity: carta.rarity
            }
          })
        )
      );

      // Marcar el pack como abierto
      await prisma.pack.update({
        where: { id: packId },
        data: { opened: true }
      });

      return cartas;
    });

    return cartasCreadas;
  }

  findAll() {
    return this.prisma.pack.findMany();
  }

  findOne(id: number) {
    return this.prisma.pack.findUnique({ where: { id } });
  }

  remove(id: number) {
    return this.prisma.pack.delete({ where: { id } });
  }
}
