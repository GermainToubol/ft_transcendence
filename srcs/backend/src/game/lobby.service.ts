import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateGameRoomDto } from "./room.dto";
import { Room } from "./room.entity";

@Injectable()
export class LobbyService {
	constructor(
		@InjectRepository(Room) private roomRepository: Repository<Room>,
	) {}

	async getRooms(): Promise<{rooms: Room[]}> {
		const rooms = await this.roomRepository.find();
		return {rooms: rooms};
	}

	async addRooms(createRoom: CreateGameRoomDto): Promise<Room> {
		const { roomname, player1, player2 } = createRoom;
		const room = new Room();

		room.roomname = roomname;
		room.player1 = player1;
		room.player2 = player2;
		try {
			await this.roomRepository.save(room);
		} catch (err) {
			throw new InternalServerErrorException();
		}
		return room;
	}

	async deleteRoom(roomname: string) {
		await this.roomRepository.delete({ roomname: roomname });
	}
}