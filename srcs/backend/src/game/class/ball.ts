import { ballInterface } from "../interfaces/ball.interface"
import { boundsInterface } from "../interfaces/bounds.interface"
import { Paddle } from "./paddle"

export class Ball {
	private _x: number
	private _y: number
	private _speed: number
	private _color: string
	private _radius: number
	private _speedX: number
	private _speedY: number
	private _mode: boolean

	constructor(
		x: number,
		y: number,
		color: string,
		radius: number,
		mode: boolean
	) {
		this._x = x
		this._y = y
		this._speed = mode ? 7 : 5
		this._color = color
		this._radius = radius
		this._speedX = 5
		this._speedY = 5
		this._mode = mode
	}

	public get x(): number {
		return this._x
	}

	public get y(): number {
		return this._y
	}

	public get speed(): number {
		return this._speed
	}

	public get color(): string {
		return this._color
	}

	public get radius(): number {
		return this._radius
	}

	public get speedX(): number {
		return this._speedX
	}

	public get speedY(): number {
		return this._speedY
	}

	public set x(x: number) {
		this._x = x
	}

	public set y(y: number) {
		this._y = y
	}

	public set color(color: string) {
		this._color = color
	}

	public set radius(radius: number) {
		this._radius = radius
	}

	public get bounds(): boundsInterface {
		return {
			left: this._x - this._radius,
			right: this._x + this._radius,
			upper: this._y- this._radius,
			lower: this._y + this._radius
		};
	}

	public collision(paddle: Paddle) {
		const { left: paddleLeft, right: paddleRight, upper: paddleTop, lower: paddleBot } = paddle.bounds;
		const { left: ballLeft, right: ballRight, upper: ballTop, lower: ballBot } = this.bounds;
		return ballRight > paddleLeft && ballLeft < paddleRight && ballTop < paddleBot && ballBot > paddleTop;
	}

	public updateBall(playgroundWidth: number, playgroundHeight: number, leftPaddle: Paddle, rightPaddle: Paddle) {
		this._x += this._speedX;
		this._y += this._speedY;

		if (this._y + this._radius > playgroundHeight || this._y - this._radius < 0) {
			this._speedY *= -1;
		}

		const player = this._x + this._radius < playgroundWidth / 2 ? leftPaddle : rightPaddle;

		if (this.collision(player)) {
			let collisionPoint = this._y - (player.y + player.height / 2);
			collisionPoint /= player.height / 2;

			const angle = (Math.PI / 4) * collisionPoint;
			const direction = this._x + this._radius < playgroundWidth / 2 ? 1 : -1;

			this._speed += 1;
			this._speedX = direction * this._speed * Math.cos(angle);
			this._speedY = this._speed * Math.sin(angle);
		}
	}

	public getBallInterface(): ballInterface {
		return {
			x: this._x,
			y: this._y,
			speed: this._speed,
			color: this._color,
			radius: this._radius,
			speedX: this._speedX,
			speedY: this._speedY,
		}
	}

	public clean(x: number, y: number) {
		this._x = x;
		this._y = y;
		this._speed = this._mode ? 7 : 5;
		this._speedX = Math.random() > 0.5 ? -5 : 5;
	}
}
