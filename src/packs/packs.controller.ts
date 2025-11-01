import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PacksService } from './packs.service';
import { OpenPackDto } from './dto/open-pack.dto';
// import { UpdatePackDto } from './dto/update-pack.dto';

@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Post('open/:id')
  open(@Param('id') id: string) {
    return this.packsService.openPack(parseInt(id));
  }

  @Get()
  findAll() {
    return this.packsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePackDto: UpdatePackDto) {
  //   return this.packsService.update(+id, updatePackDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packsService.remove(+id);
  }
}
