import { boundsInterface } from "../interfaces/bounds.interface";
import { playGroundInterface } from "../interfaces/playground.interface";
import { Ball } from "./ball";
import { Control } from "./control";
import { Paddle } from "./paddle";
import { ScoreBoard } from "./scoreboard";

export class Playground {
	private _x: number;
	private _y: number;
	private _width: number;
	private _height: number;
	private _color: string;
	private _ball: Ball;
	private _leftPaddle: Paddle;
	private _rightPaddle: Paddle;
	private _leftPaddleController: Control;
	private _rightPaddleController: Control;
	private _scoreBoard: ScoreBoard;
	private _win_score: number;
	private _player1: string;
	private _player2: string;
  
	constructor(x: number, y: number, width: number, height: number, color: string, win_score: number, player1: string, player2: string, mode: boolean) {
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._color = color;
		this._leftPaddle = new Paddle(
			this._x + this.getPaddleWidth(),
			(this._x + this._height) / 2 - (this._y + this.getPaddleHeight()) / 2,
			this.getPaddleWidth(),
			this.getPaddleHeight(),
			mode ? '#000000' : '#A9BCCBff');
		this._rightPaddle = new Paddle(
			this._x + this._width - this.getPaddleWidth() * 2,
			(this._y + this._height) / 2 - this.getPaddleHeight() / 2,
			this.getPaddleWidth(),
			this.getPaddleHeight(),
			mode ? '#000000' : '#A9BCCBff');
		this._ball = new Ball(
			this._width / 2,
			this._height / 2,
			mode ? '#000000' : '#A9BCCBff',
			this.getRadius(),
			mode);
	  this._leftPaddleController = new Control(this._leftPaddle);
	  this._rightPaddleController = new Control(this._rightPaddle);
	  this._scoreBoard = new ScoreBoard();
	  this._win_score = win_score;
	  this._player1 = player1;
	  this._player2 = player2;
	}
  
	public get x(): number {
	  return this._x;
	}
	public get y(): number {
	  return this._y;
	}
	public get width(): number {
	  return this._width;
	}
	public get height(): number {
	  return this._height;
	}
	public get color(): string {
	  return this._color;
	}
	public get ball(): Ball {
	  return this._ball;
	}
	public get leftPaddle(): Paddle {
	  return this._leftPaddle;
	}
	public get rightPaddle(): Paddle {
	  return this._rightPaddle;
	}
	public get leftPaddleController(): Control {
	  return this._leftPaddleController;
	}
	public get rightPaddleController(): Control {
	  return this._rightPaddleController;
	}
	public get win_score(): number {
	  return this._win_score;
	}
  
	public get player1(): string {
	  return this._player1;
	}
  
	public get player2(): string {
	  return this._player1;
	}
  
	private getRadius(): number {
	  let rad = (this._width + this._height) / 25 < 20 ? (this._width + this._height) / 25 : 20;
	  return rad;
	}
  
	private getPaddleWidth(): number {
	  let wid = this._width / 15 < 12 ? this._width / 15 : 12;
	  return wid;
	}
  
	private getPaddleHeight(): number {
	  let hei = this._height / 5 < 150 ? this._height / 5 : 150;
	  return hei;
	}
  
	public getPlayGroundInterface(): playGroundInterface {
	  return {
		x: this._x,
		y: this._y,
		width: this._width,
		height: this._height,
		color: this._color,
		leftPaddle: this._leftPaddle.getPaddleInterface(),
		rightPaddle: this._rightPaddle.getPaddleInterface(),
		ball: this._ball.getBallInterface(),
		score: this._scoreBoard.getScoreInterface(),
		player1: this._player1,
		player2: this._player2,
	  };
	}
  
  
	public get bounds(): boundsInterface {
	  return {
		left: this._x,
		right: this._x + this._width,
		upper: this._y,
		lower: this._y + this.height,
	  };
	}
  
	public get scoreBoard(): ScoreBoard {
	  return this._scoreBoard;
	}
  
	public update(): boolean {
		if (this._scoreBoard.playerOneScore !== this._win_score &&
			this._scoreBoard.playerTwoScore !== this._win_score) {
		this._leftPaddleController.update(this.bounds);
		this._rightPaddleController.update(this.bounds);
		this._ball.updateBall(
		  this._width,
		  this._height,
		  this._leftPaddle,
		  this._rightPaddle,);
		if (this._ball.x - this._ball.radius < 0) {
		  this._scoreBoard.playerTwoGoal();
		  this._ball.clean(this._width / 2, this._height / 2);
		} else if (this._ball.x + this._ball.radius > this._width) {
		  this._scoreBoard.playerOneGoal();
		  this._ball.clean(this._width / 2, this._height / 2);
		}
		return false;
	  } else {
		return true;
	  }
	}
}