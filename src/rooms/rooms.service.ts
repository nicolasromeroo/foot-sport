import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './interfaces/room';

@Injectable()
export class RoomService {
  private rooms: Record<string, Room> = {};
  private playerRooms: Record<string, string> = {}; // Map player ID to room ID

  generateRoomCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  createPrivateRoom(playerId: string, username: string, pointsInGame: number): Room {
    const roomCode = this.generateRoomCode();
    const room: Room = {
      id: `private-${roomCode}`,
      isPrivate: true,
      roomCode,
      playersUsernames: [username],
      playersSelected: {},
      maxPlayers: 2,
      pointsInGame,
      status: 'waiting'
    };

    this.rooms[room.id] = room;
    this.playerRooms[playerId] = room.id;
    return room;
  }

  joinPrivateRoom(playerId: string, username: string, roomCode: string): Room | null {
    const room = Object.values(this.rooms).find(r => r.roomCode === roomCode);
    
    if (!room || room.playersUsernames.length >= room.maxPlayers) {
      return null;
    }

    room.playersUsernames.push(username);
    this.playerRooms[playerId] = room.id;

    if (room.playersUsernames.length === room.maxPlayers) {
      room.status = 'selecting';
    }

    return room;
  }

  selectPlayers(roomId: string, playerId: string, selectedPlayers: string[]): Room | null {
    const room = this.rooms[roomId];
    if (!room || selectedPlayers.length !== 5) {
      return null;
    }

    room.playersSelected[playerId] = selectedPlayers;

    // Check if all players have selected their teams
    if (Object.keys(room.playersSelected).length === room.maxPlayers) {
      room.status = 'playing';
    }

    return room;
  }

  finishGame(roomId: string, winner: string): Room | null {
    const room = this.rooms[roomId];
    if (!room) {
      return null;
    }

    room.status = 'finished';
    room.winner = winner;
    return room;
  }

  onPlayerConnected(room: Room) {
    this.rooms[room.id] = room;
  }

  onPlayerDisconnected(playerId: string) {
    const roomId = this.playerRooms[playerId];
    if (roomId) {
      const room = this.rooms[roomId];
      if (room) {
        room.playersUsernames = room.playersUsernames.filter(username => 
          username !== room.playersUsernames[room.playersUsernames.findIndex(u => u === playerId)]);
        
        if (room.playersUsernames.length === 0) {
          delete this.rooms[roomId];
        }
      }
      delete this.playerRooms[playerId];
    }
  }

  getRoomByCode(roomCode: string): Room | null {
    return Object.values(this.rooms).find(room => room.roomCode === roomCode) || null;
  }

  getRoomById(roomId: string): Room | null {
    return this.rooms[roomId] || null;
  }
  // create(createRoomDto: CreateRoomDto) {
  //   const id = Date.now().toString();

  //   this.rooms[id] = { id, ...createRoomDto };
  //   return this.rooms[id];  
  // }

  // findAll() {
  //   return Object.values(this.rooms);
  // }

  // findOne(id: string) {
  //   return this.rooms[id];
  // }

  // remove(id: string) {
  //   const room = this.rooms[id];
  //   delete this.rooms[id];
  //   return room;  
  // }

  // update(id: string, updateRoomDto: UpdateRoomDto) {
  //   this.rooms[id] = { ...this.rooms[id], ...updateRoomDto };
  //   return this.rooms[id];
  // }
}
