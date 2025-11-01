import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
// import { PlayersModule } from './players/players.module';
import { PacksModule } from './packs/packs.module';
import { PrismaModule } from './prisma/prisma.module';
import { MazoModule } from './mazo/mazo.module';
import { RoomsModule } from './rooms/rooms.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TestGateway } from './test.gateway';
import { RoomGateway } from './rooms/rooms.gateway';
import { RoomService } from './rooms/rooms.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
    // PlayersModule, 
    PacksModule, MazoModule, RoomsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TestGateway, RoomGateway, RoomService],
})
export class AppModule {}
