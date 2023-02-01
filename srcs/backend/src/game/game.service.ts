import { Injectable, Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { GameHistoryService } from "src/history/history.service";
import { UsersService } from "src/users/user.service";
import { UserStatus } from "src/users/user_status.enum";
import { Playground } from "./class/playground";
import { playGroundInterface } from "./interfaces/playground.interface";
import { LobbyService } from "./lobby.service";

@Injectable()
export class GameService {
	readonly logger = new Logger('Game Service: ');
	readonly playground = new Playground(0, 0, 1000, 600, '#ffffff', 10, '', '', false);
	readonly hardplayground = new Playground(0, 0, 1000, 600, '#680407', 10, '', '', true);

	constructor(
		private lobbyService: LobbyService,
		private gameHistoryService: GameHistoryService,
		private usersService: UsersService
	) {}

	getPlayground(playground: Playground): playGroundInterface {
		return playground.getPlayGroundInterface();
	}

	async handleConnectedUser(client: Socket, players: Socket[], playershard: Socket[], playerschat: Socket[], playerschathard: Socket[], server: Server) {
		if (client.handshake.query.role === 'player' && client.handshake.query.mode === 'normal' && client.handshake.query.chat === 'chat') {
			await this.handleConnectedPlayer(client, playerschat, server, false);
		} else if (client.handshake.query.role === 'player' && client.handshake.query.mode === 'hard' && client.handshake.query.chat === 'chat') {
			await this.handleConnectedPlayer(client, playerschathard, server, true);
		} else if (client.handshake.query.role === 'player' && client.handshake.query.mode === 'normal') {
			await this.handleConnectedPlayer(client, players, server, false);
		} else if (client.handshake.query.role === 'player' && client.handshake.query.mode === 'hard') {
			await this.handleConnectedPlayer(client, playershard, server, true);
		} else if (client.handshake.query.role === 'spectator') {
			this.logger.log('Spectator connected: ' + client.id + ', roomname: ' + client.handshake.query.roomname);
			await this.handleConnectedSpectator(client);
		}
	}

	async handleConnectedPlayer(client: Socket, players: Socket[], server: Server, mode: boolean) {
		let user = await this.usersService.checkToken(client.handshake.query.accessToken as string);
		if (!user) {
			this.logger.error('Token Wasn\'t Verified');
			client.emit('tokenError', { message: 'Token Wasn\'t Verified' });
			return;
		}
		client.data.user = user;
		/*if (user && user.status === UserStatus.PLAYING) {
			client.emit('alreadyPlaying', { player: user.usual_full_name, message: 'You Are Already in a Game' });
		} else */if (user /* && user.status === UserStatus.ONLINE */) {
			let update = await this.usersService.updateStatus(user.login, UserStatus.PLAYING);
			if (!update) {
			  this.logger.error('Couldn\'t Update Status');
			  return;
			}
			players.push(client);
			if (players.length === 1) {
			  client.data.side = 'left';
			  client.data.role = 'player';
			  client.emit('waitingForPlayer', { player: user.usual_full_name, message: 'Waiting For Second Player', playground: this.playground.getPlayGroundInterface() });
			} else {
			  client.data.side = 'right';
			  client.data.role = 'player';
			  const second = players.pop();
			  const first = players.pop();
			  this.startGame(first, second, server, mode);
			}
		}
	}

	startGame(first: Socket, second: Socket, server: Server, mode: boolean) {
		const roomname = first.id + second.id;

		first.join(roomname);
		second.join(roomname);
		first.data.roomname = roomname;
		second.data.roomname = roomname;
		
		first.data.opponentId = second.data.user.id;
		second.data.opponentId = first.data.user.id;
		
		let add = this.lobbyService.addRooms({ roomname, player1: first.data.user.usual_full_name as string, player2: second.data.user.usual_full_name as string });
		if (!add)
			return
		const playground = new Playground(0, 0, 1000, 600, mode ? '#680407' : '#ffffff', 10, first.data.user.usual_full_name, second.data.user.usual_full_name, mode);
		first.data.playground = playground;
		second.data.playground = playground;
		this.logger.log('Starting Game in Room: ' + roomname + ' between: ' + first.data.user.usual_full_name + ' & '+ second.data.user.usual_full_name);
		let count = 0;
		const timer = setInterval(() => {
			if (playground.update() == false) {
				const pgi = this.getPlayground(playground);
				server.to(roomname).emit('updatePlayground', { name: roomname, playground: pgi });
			} else {
				this.endGame(first, second, server, playground, mode);
			}
		}, (1.0 / 60) * 1000);
		first.data.gameInterval = timer;
		second.data.gameInterval = timer;
	}

	async endGame(first: Socket, second: Socket, server: Server, playground: Playground, mode: boolean) {
		clearInterval(first.data.gameInterval);
		this.logger.log('Game in Room: ' + first.data.roomname + ' between: ', first.data.user.usual_full_name + ' & ' + second.data.user.usual_full_name + ' Finished');
		if (playground.scoreBoard.playerOneScore > playground.scoreBoard.playerTwoScore) {
			server.to(first.data.roomname).emit('endGame', { winner: first.data.user.usual_full_name, loser: second.data.user.usual_full_name });
			let add = await this.gameHistoryService.addGameHistory({ userId: first.data.user.id as number, opponentId: first.data.opponentId as number, playerOneScore: playground.scoreBoard.playerOneScore as number, playerTwoScore: playground.scoreBoard.playerTwoScore as number, hard: mode });
			if (!add)
				return
				let add2 = await this.gameHistoryService.addGameHistory({ userId: first.data.opponentId as number, opponentId: first.data.user.id as number, playerOneScore: playground.scoreBoard.playerTwoScore as number, playerTwoScore: playground.scoreBoard.playerOneScore as number, hard: mode });
			if (!add2)
				return
			let wins = await this.usersService.updateWins(first.data.user.id, first.data.user.wins + 1)
			if (!wins)
				return
		} else {
			console.log(second.data.user.usual_full_name)
			server.to(first.data.roomname).emit('endGame', { winner: second.data.user.usual_full_name, loser: first.data.user.usual_full_name });
			let add = await this.gameHistoryService.addGameHistory({ userId: first.data.user.id as number, opponentId: first.data.opponentId as number, playerOneScore: playground.scoreBoard.playerOneScore as number, playerTwoScore: playground.scoreBoard.playerTwoScore as number, hard: mode });
			if (!add)
				return
			let add2 = await this.gameHistoryService.addGameHistory({ userId: first.data.opponentId as number, opponentId: first.data.user.id as number, playerOneScore: playground.scoreBoard.playerTwoScore as number, playerTwoScore: playground.scoreBoard.playerOneScore as number, hard: mode });
			if (!add2)
				return
			let wins = await this.usersService.updateWins(second.data.user.id, second.data.user.wins + 1)
			if (!wins)
				return
		}
		let del = await this.lobbyService.deleteRoom(first.data.roomname);
		if (!del)
			this.logger.error('Error trying to delete room');
	}

	async handleDisonnectedUser(client: Socket, server: Server) {
		if (client.handshake.query.role === 'player' && client.data.gameInterval) {
			if (client.data.gameInterval._destroyed === false) {
				client.data.playground.ball.clean(client.data.playground.width / 2, client.data.playground.height / 2);
				client.data.playground.leftPaddle.clean();
				client.data.playground.rightPaddle.clean();
				if (client.data.side === 'left') {
					client.data.playground.scoreBoard.playerTwoScore = client.data.playground.win_score
			 	} else {
					client.data.playground.scoreBoard.playerOneScore = client.data.playground.win_score
			  	}
				server.to(client.data.roomname).emit('interruptedGame', { playground: this.getPlayground(client.data.playground) });
				clearInterval(client.data.gameInterval);
				let second = await this.usersService.findOneById(client.data.opponentId);
				server.to(client.data.roomname).emit('abortedGame', { winner: second.usual_full_name, loser: client.data.user.usual_full_name });
				let del = await this.lobbyService.deleteRoom(client.data.roomname);
				if (!del)
					this.logger.error('Error trying to delete room');
				else
					this.logger.log('Game in Room: ' + client.data.roomname + ' Finished');
			}
			client.leave(client.data.roomname);
			let update = await this.usersService.updateStatus(client.data.user.login, UserStatus.OFFLINE);
			if (!update)
				this.logger.error('Couldn\'t Update Status');
		} else if (client.handshake.query.role === 'player') {
			let update = await this.usersService.updateStatus(client.data.user.login, UserStatus.OFFLINE);
			if (!update)
				this.logger.error('Couldn\'t Update Status');
		}
	}

	async handleConnectedSpectator(client: Socket) {
		const { rooms } = await this.lobbyService.getRooms();
		const roomname = client.handshake.query.roomname;
		const specroom = rooms.find(room => room.roomname == roomname);
		if (specroom) {
			client.join(roomname);
		} else {
			client.emit('roomNotFound', {message: 'No such a Room'});
		}
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