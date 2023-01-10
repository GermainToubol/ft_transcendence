import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { UsersService } from "src/users/user.service";
import { LobbyService } from "./lobby.service";

@Injectable()
export class GameService {
	readonly logger = new Logger('Game Service: ');

	constructor(
		private lobbyService: LobbyService,
		private usersService: UsersService
	) {}

	async handleConnectedUser(client: Socket, players: Socket[], wss: Server) {
		if (client.handshake.query.role === 'player') {
			await this.handleConnectedPlayer(client, players, wss);
		} else if (client.handshake.query.role === 'spectator') {
			await this.handleConnectedSpectator(client);
		}
	}

	async handleConnectedPlayer(client: Socket, players: Socket[], wss: Server) {

	}

	async handleConnectedSpectator(client: Socket) {

	}

	async handleDisonnectedUser(client: Socket, wss: Server) {
		
	}
}