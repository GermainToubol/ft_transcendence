import LocalFile from "src/localfiles/localFile.entity";
import { playerInterface } from "../interfaces/player.interface";

export class Player {
	private _id: number;
	private _pseudo: string;
	private _avatar: LocalFile;

	constructor(id: number, pseudo: string, avatar: LocalFile) {
		this._id = id;
		this._pseudo = pseudo;
		this._avatar = avatar;
	}

	public get id(): number {
		return this._id;
	}

	public get pseudo(): string {
		return this._pseudo;
	}

	public get avatar(): LocalFile {
		return this._avatar;
	}

	public getPlayerInterface(): playerInterface {
		return {
			id: this._id,
			usual_full_name: this._pseudo,
			avatar: this._avatar
		};
	}

}