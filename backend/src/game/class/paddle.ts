import { boundsInterface } from "../interfaces/bounds.interface"
import { paddleInterface } from "../interfaces/paddle.interface"

export class Paddle {
	private _x: number
	private _y: number
	private _xStart: number
	private _yStart: number
	private _width: number
	private _height: number
	private _color: string

	constructor(x: number, y: number, width: number, height: number, color: string) {
		this._x = x
		this._y = y
		this._xStart = x
		this._yStart = y
		this._width = width
		this._height = height
		this._color = color
	}

	public get x(): number {
		return this._x
	}

	public get y(): number {
		return this._y
	}

	public get width(): number {
		return this._width
	}

	public get height(): number {
		return this._height
	}

	public get color(): number {
		return this._x
	}

	public get bounds(): boundsInterface {
		return {
			left: this._x,
			right: this._x + this._width,
			upper: this._y,
			lower: this._y + this._height
		}
	}

	public set x(value: number) {
		this._x = value
	}

	public set y(value: number) {
		this._y = value
	}

	public set width(value: number) {
		this._width = value
	}

	public set height(value: number) {
		this._height = value
	}

	public set color(value: number) {
		this._x = value
	}

	public getPaddleInterface(): paddleInterface {
		return {
			x: this._x,
			y: this._y,
			width: this._width,
			height: this._height,
			color: this._color
		}
	}

	public update(x: number, y: number) {
		this._x = x
		this._y = y
	}

	public up(bounds: boundsInterface) {
		this._y -= 5 // valeur a tester
		if (this._y < bounds.upper) {
			this._y = bounds.upper
		}
	}

	public down(bounds: boundsInterface) {
		this._y += 5
		if (this._y + this._height > bounds.lower) {
			this._y = bounds.lower - this._height
		}
	}

	public clean() {
		this._x = this._xStart
		this._y = this._yStart
	}
}
