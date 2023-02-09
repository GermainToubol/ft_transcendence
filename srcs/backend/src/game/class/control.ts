import { boundsInterface } from "../interfaces/bounds.interface"
import { Paddle } from "./paddle"

export class Control {
	private _paddle: Paddle
	private _keyUp: boolean
	private _keyDown: boolean

	constructor(paddle: Paddle) {
		this._paddle = paddle
		this._keyDown = false
		this._keyUp = false
	}

	public keyUp() {
		this._keyUp = true
	}

	public keyDown() {
		this._keyDown = true
	}

	public keyUpUnpressed() {
		this._keyUp = false
	}

	public keyDownUnpressed() {
		this._keyDown = false
	}

	public get speed(): number {
		let speed = 0
		if (this._keyUp) {
			speed -= 1
		}
		if (this._keyDown) {
			speed += 1
		}
		return speed
	}

	public update(bounds: boundsInterface) {
		if (this.speed > 0) {
			this._paddle.down(bounds)
		} else if (this.speed) {
			this._paddle.up(bounds)
		}
	}
}
