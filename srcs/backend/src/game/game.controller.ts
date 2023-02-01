import { Controller, Get, UseGuards } from "@nestjs/common"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Room } from "./room.entity"
import { LobbyService } from "./lobby.service"


@Controller('rooms')
export class GameController {
	constructor(private lobbyService: LobbyService) {}

	@Get('/')
	@UseGuards(JwtAuthGuard)
	async getRooms(): Promise<{rooms: Room[]}> {
		return await this.lobbyService.getRooms()
	}
}