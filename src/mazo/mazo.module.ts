import { Module } from '@nestjs/common';
import { MazoService } from './mazo.service';
import { MazoController } from './mazo.controller';

@Module({
  controllers: [MazoController],
  providers: [MazoService],
})
export class MazoModule {}
