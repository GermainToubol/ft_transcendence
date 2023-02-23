import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { CreateGameHistoryDto } from "./history.dto"
import { GameHistory } from "./history.entity"

@Injectable()
export class GameHistoryService {
	constructor(
		@InjectRepository(GameHistory) private gameHistoryRepository: Repository<GameHistory>,
	) {}

	async addGameHistory(createGameHistory: CreateGameHistoryDto): Promise<GameHistory> {
		const { userId, opponentId, playerOneScore, playerTwoScore, hard } = createGameHistory
		const history = new GameHistory()
		history.userId = userId
		history.opponentId = opponentId
		history.playerOneScore = playerOneScore
		history.playerTwoScore = playerTwoScore
		history.hard = hard
		let add = await this.gameHistoryRepository.save(history);
		if (!add)
			return null
		return history
	}
}