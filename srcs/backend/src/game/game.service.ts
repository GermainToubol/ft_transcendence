import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/user.service";
import { UserStatus } from "src/users/user_status.enum";
import { Playground } from "./class/playground";
import { playGroundInterface } from "./interfaces/playground.interface";
import { LobbyService } from "./lobby.service";

@Injectable()
export class GameService {
	readonly logger = new Logger('Game Service: ');
	readonly playground = new Playground(0, 0, 1000, 600, '#ffffff', 9, '', '');

	constructor(
		private lobbyService: LobbyService,
		private usersService: UsersService
	) {}

	getPlayground(playground: Playground): playGroundInterface {
		return playground.getPlayGroundInterface();
	}

	async handleConnectedUser(client: Socket, players: Socket[], wss: Server) {
		if (client.handshake.query.role === 'player') {
			await this.handleConnectedPlayer(client, players, wss);
		} else if (client.handshake.query.role === 'spectator') {
			this.logger.log('spectator Connected: ' + client.id + ', roomname: ' + client.handshake.query.roomname);
			await this.handleConnectedSpectator(client);
		}
	}

	async handleConnectedPlayer(client: Socket, players: Socket[], wss: Server) {
		let user: User;
		try {
			user = await this.usersService.checkToken(client.handshake.query.accessToken as string);
		} catch (err) {
			this.logger.error('Token Wasn\'t Verified');
			client.emit('TokenError', { message: 'Token Wasn\'t Verified' });
			return;
		}
		client.data.user = user;
		console.log(user.status)
		if (user && user.status === UserStatus.PLAYING) {
			client.emit('alreadyInGame', {
			  player: user.usual_full_name,
			  message: 'You Are Already in a Game',
			});
		  }
		  else if (user && user.status === UserStatus.OFFLINE) {
			try {
			  await this.usersService.updateStatus(user.login, UserStatus.PLAYING);
			} catch (err) {
			  this.logger.error('Couldn\'t Update Status');
			  return;
			}
			players.push(client);
			if (players.length === 1) {
			  client.data.side = 'left';
			  client.data.role = 'player';
			  client.emit('WaitingForPlayer', {
				player: user.usual_full_name,
				message: 'Waiting For Second Player',
				playground: this.playground.getPlayGroundInterface(),
			  });
			} else {
			  client.data.side = 'right';
			  client.data.role = 'player';
			  const second = players.pop();
			  const first = players.pop();
			  this.startGame(first, second, wss);
			}
		  }
	}

	startGame(first: Socket, second: Socket, wss: Server) {
		const roomname = first.id + second.id;

		first.join(roomname);
		second.join(roomname);
		first.data.roomname = roomname;
		second.data.roomname = roomname;

		first.data.opponentId = second.data.user.id;
		second.data.opponentId = first.data.user.id;

		this.lobbyService.addRooms({
			roomname, player1: first.data.user.usual_full_name as string, player2: second.data.user.usual_full_name as string
		});

		const playground = new Playground(0, 0, 1000, 600, '#ffffff', 9, first.data.user.username, second.data.user.username);
		first.data.playground = playground;
		second.data.playground = playground;
		this.logger.log('Starting Game in Room: ' + roomname + ' between: ' + first.data.user.username + ' & '+ second.data.user.username);
		const timer = setInterval(() => {
			if (playground.update() == false) {
				const pgi = this.getPlayground(playground);
				wss
					.to(roomname)
					.emit('updatePlayGround', { name: roomname, playground: pgi });
			} //else {
			// 	this.endGame(first, second, playground, wss);
			// }
		}, (1.0 / 60) * 1000);
		first.data.gameIntervail = timer;
		second.data.gameInterval = timer;
	}

	async handleConnectedSpectator(client: Socket) {
	}

	async handleDisonnectedUser(client: Socket, wss: Server) {
		
	}

	handleKeyUp(client: Socket) {
		if (client.data.role === 'player' && client.data.side === 'left') {
			client.data.playground.leftPaddleController.keyUp();
		} else if (client.data.role === 'player' && client.data.side === 'right') {
			client.data.playground.rightPaddleController.keyUp();
		}
	}

	handleKeyUpUnpressed(client: Socket) {
		if (client.data.role === 'player' && client.data.side === 'left') {
			client.data.playground.leftPaddleController.keyUpUnpressed();
		} else if (client.data.role === 'player' && client.data.side === 'right') {
			client.data.playground.rightPaddleController.keyUpUnpressed();
		}
	}

	handleKeyDown(client: Socket) {
		if (client.data.role === 'player' && client.data.side === 'left') {
			client.data.playground.leftPaddleController.keyDown();
		} else if (client.data.role === 'player' && client.data.side === 'right') {
			client.data.playground.rightPaddleController.keyDown();
		}
	}

	handleKeyDownUnpressed(client: Socket) {
		if (client.data.role === 'player' && client.data.side === 'left') {
			client.data.playground.leftPaddleController.keyDownUnpressed();
		} else if (client.data.role === 'player' && client.data.side === 'right') {
			client.data.playground.rightPaddleController.keyDownUnpressed();
		}
	}
}