import { Injectable } from '@nestjs/common';
import { CreateMazoDto } from './dto/create-mazo.dto';
import { UpdateMazoDto } from './dto/update-mazo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MazoService {
  constructor(private prisma: PrismaService) {}

  async create(createMazoDto: CreateMazoDto) {
    return this.prisma.mazo.create({
      data: {
        nombre: createMazoDto.nombre,
        usuarioId: createMazoDto.usuarioId
      },
    });
  }

  async findAll() {
    return this.prisma.mazo.findMany();
  }

  async findOne(id: number) {
    return this.prisma.mazo.findUnique({
      where: { id }
    });
  }

  update(id: number, updateMazoDto: UpdateMazoDto) {
    return `This action updates a #${id} mazo`;
  }

  remove(id: number) {
    return `This action removes a #${id} mazo`;
  }
}
