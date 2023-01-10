import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({namespace: '/match', cors: true, path: '/game/match'})
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() wss: Server;
	private players: Socket[];

	constructor(private gameService: GameService) {
		this.players = [];
	}

	async handleConnection(client: Socket) {
		await this.gameService.handleConnectedUser(client, this.players, this.wss);
	}

	async handleDisconnect(client: Socket) {
		this.players = this.players.filter((client2) => {
			return client2.id != client.id;
		});
		await this.gameService.handleDisonnectedUser(client, this.wss);
	}

	@SubscribeMessage('message')
	handleMessage(client: Socket): string {
		return 'Hello world!';
	}
	// Add subscribe message with all keypress(up, down, unpress) and one for y contact between ball and paddle
}
