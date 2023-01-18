import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/user.service";
import { User } from "../users/user.entity";
import { JwtPayload } from "./type/jwt-payload.type";
import { jwtConstants } from "./constants";
import { UserStatus } from "src/users/user_status.enum";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(payload: JwtPayload): Promise<User> {
        const login = payload.login;
		const user = await this.usersService.findOne(login);
		if (!user) {
			return null;
		}
		if (user.status == UserStatus.OFFLINE) {
			let update = await this.usersService.updateStatus(user.login, UserStatus.ONLINE)
			if (!update)
				return null;
		}
		return user;
    }

    async login(req: any): Promise<any> {
		let user = await this.usersService.findOne(req.login);
		let enable2fa: Boolean;
		let pseudo: string;
		let avatar: number;
		if (user && (user.status === UserStatus.ONLINE || user.status === UserStatus.PLAYING))
			return null;
		if (user && user.is2faEnabled) {
			enable2fa = true;
		} else if (!user) {
			enable2fa = false;
			user = await this.usersService.create(req).then();
			if (!user)
				return null;
			let update = await this.usersService.updateStatus(user.login, UserStatus.ONLINE)
			if (!update)
				return null;
		} else {
			enable2fa = false;
			let update = await this.usersService.updateStatus(user.login, UserStatus.ONLINE)
			if (!update)
				return null;
		}
		pseudo = await this.usersService.getPseudo(user.login).then();
		avatar = await this.usersService.getAvatarId(user.login).then();
		const payload: JwtPayload = { id: user.id, login: user.login, email: user.email, twoFa: false };
		const token = this.jwtService.sign(payload);
		return {token: token, enable2fa: enable2fa, pseudo: pseudo, avatar: avatar};
    }

	async logout(user: User): Promise<any> {
		await this.usersService.updateStatus(user.login, UserStatus.OFFLINE);
	}

    async getUserFromToken(token: string): Promise<User> {
        const payload: JwtPayload = this.jwtService.verify(token, {
             secret: jwtConstants.secret,
        });
        if (payload.login) {
              return await this.usersService.findOne(payload.login);
        }
        return null;
    }
}
