
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { GameService } from './game.service'

@WebSocketGateway({cors: true, path: '/game'})
export class GameGateway 
	implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server
	private players: Socket[]
	private playershard: Socket[]
	private playerschat: Socket[]
	private playerschathard: Socket[]

	constructor(private gameService: GameService) {
		this.players = []
	}

	async handleConnection(client: Socket) {
		await this.gameService.handleConnectedUser(client, this.players, this.playershard, this.playerschat, this.playerschathard, this.server)
	}

	async handleDisconnect(client: Socket) {
		this.players = this.players.filter((client2) => {
			return client2.id != client.id
		})
		await this.gameService.handleDisonnectedUser(client, this.server)
	}

	@SubscribeMessage('KeyUp')
	handleKeyUp(client: Socket) {
		if (client.data.playground) {
			this.gameService.handleKeyUp(client)
		}
	}

	@SubscribeMessage('KeyUpUnpressed')
	handleKeyUpUnpressed(client: Socket) {
		if (client.data.playground) {
			this.gameService.handleKeyUpUnpressed(client)
		}
	}

	@SubscribeMessage('KeyDown')
	handleKeyDown(client: Socket) {
		if (client.data.playground) {
			this.gameService.handleKeyDown(client)
		}
	}

	@SubscribeMessage('KeyDownUnpressed')
	handleKeyDownUnpressed(client: Socket) {
		if (client.data.playground) {
			this.gameService.handleKeyDownUnpressed(client)
		}
	}
}