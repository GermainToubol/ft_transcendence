import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/user.service";
import { User } from "../users/user.entity";
import { JwtPayload } from "./type/jwt-payload.type";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    /* an async function  used for validate the user if exist in database */
    async validateUser(payload: JwtPayload): Promise<User> {
        const login = payload.login;
        try {
            const user = await this.usersService.findOne(login);
            if (!user) {
                return null;
            }
            return user;
        } catch {
            return null;
        }
    }

    /* function used for creating the user if not exist and sign it */
    async login(req: any): Promise<any> {
        try {
            let user = await this.usersService.findOne(req.login);
			let enable2fa: Boolean;
			let pseudo: string;
			let avatar: number;
            if (user && user.is2faEnabled) {
				enable2fa = true;
            }
            else if (!user) {
				enable2fa = false;
                user = await this.usersService.create(req).then();
            }
			else {
				enable2fa = false;
            }
			pseudo = await this.usersService.getPseudo(user.login).then();
			avatar = await this.usersService.getAvatarId(user.login).then();
            const payload: JwtPayload = { id: user.id, login: user.login, email: user.email, twoFa: false };
            const token = this.jwtService.sign(payload);
            return {token: token, enable2fa: enable2fa, pseudo: pseudo, avatar: avatar};
        } catch (err) {
            throw new ForbiddenException('Forbidden: user cannot log in');
        }
    }

    getUserFromToken = async (token: string): Promise<User> => {
        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: jwtConstants.secret,
            });
            if (payload.login) {
                return await this.usersService.findOne(payload.login);
            }
            return null;
        } catch (err) {
            return null;
        }
    }
}
