import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MazoService } from './mazo.service';
import { CreateMazoDto } from './dto/create-mazo.dto';
import { UpdateMazoDto } from './dto/update-mazo.dto';

@Controller('mazo')
export class MazoController {
  constructor(private readonly mazoService: MazoService) {}

  @Post()
  create(@Body() createMazoDto: CreateMazoDto) {
    return this.mazoService.create(createMazoDto);
  }

  @Get()
  findAll() {
    return this.mazoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mazoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMazoDto: UpdateMazoDto) {
    return this.mazoService.update(+id, updateMazoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mazoService.remove(+id);
  }
}
