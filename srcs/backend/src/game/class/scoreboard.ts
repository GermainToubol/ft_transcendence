import { scoreBoardInterface } from "../interfaces/scoreboard.interface";

export class ScoreBoard {
	private _playerOneScore: number;
	private _playerTwoScore: number;
	private _round: number;

	constructor() {
		this.clean();
	}

	public clean() {
		this._playerOneScore = 0;
		this._playerTwoScore = 0;
		this._round = 0;
	}

	public get playerOneScore(): number {
		return this._playerOneScore;
	}

	public get playerTwoScore(): number {
		return this._playerTwoScore;
	}
	
	public get round(): number {
		return this._round;
	}

	public set playerOneScore(score: number) {
		this._playerOneScore = score;
	}

	public set playerTwoScore(score: number) {
		this._playerTwoScore = score;
	}

	public playerOneGoal() {
		this._playerOneScore++;
		this._round++;
	}

	public playerTwoGoal() {
		this._playerTwoScore++;
		this._round++;
	}

	public getScoreInterface(): scoreBoardInterface {
		return {
			playerOneScore: this._playerOneScore,
			playerTwoScore: this._playerTwoScore,
			round: this._round
		};
	}
}