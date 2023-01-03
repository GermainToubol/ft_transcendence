import { Injectable, ForbiddenException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/user.entity";
import { JwtPayload } from "./type/jwt-payload.type";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
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
    async login(req: any, res: any): Promise<any> {
        try {
            let user = await this.usersService.findOne(req.user.login);
            let url: string;
            if (user && user.is2faEnabled) {
                res.cookie('key', user.id);
                url = 'http://localhost:3000/#/verify';
                return res.redirect(url);
            }
            else if (!user) {
                user = await this.usersService.create(req.user);
                url = 'http://localhost:3000/#/complete'; // redirect to complete page
            }
			else {
                url = 'http://localhost:3000/'; // redirect to Home page
            }
            const payload: JwtPayload = { id: user.id, login: user.usual_full_name, email: user.email };
            const token = this.jwtService.sign(payload);
            res.cookie('accessToken', token);
            return res.redirect(url);
        } catch (err) {
            throw new ForbiddenException('Forbidden: user cannot log in');
        }
    }

    getUserFromToken = async (token: string): Promise<User> => {
        try {
            const payload: JwtPayload = this.jwtService.verify(token, {
                secret: this.configService.get('JWT_SECRET'),
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
