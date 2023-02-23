import { ballInterface } from "./ball.interface";
import { paddleInterface } from "./paddle.interface";
import { scoreBoardInterface } from "./scoreboard.interface";

export interface playGroundInterface {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	leftPaddle: paddleInterface;
	rightPaddle: paddleInterface;
	ball: ballInterface;
	score: scoreBoardInterface;
	player1: string;
	player2: string;
}