import {
    Injectable,
    NotFoundException,
    UnauthorizedException
} from "@nestjs/common";
import * as dotenv from "dotenv";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../users/user.service";
import { User } from "../../users/user.entity";
import { JwtPayload } from "../type/jwt-payload.type";
import { ConfigService } from "@nestjs/config";
import { authenticator } from "otplib";
import { toDataURL } from "qrcode";
import { Response } from "express";
import { jwtConstants } from "../constants";
import { UserStatus } from "src/users/user_status.enum";

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) { }

    async enableDisableTwoFactorAuth(userId: number, bool: boolean) {
        return this.usersService.turnOnOffTwoFactorAuth(userId, bool);
    }

    async generateTwoFactorAuthSecretAndQRCode (user: User, res: Response): Promise<any>{
        const secret = authenticator.generateSecret();
        const otpauth = authenticator.keyuri(
            user.email,
            this.configService.get('APP_NAME')!,
            secret
        );
    	await this.usersService.setTwoFactorAuthSecret(user.id, secret);
        const dataUrl = await toDataURL(otpauth);
        return res.status(200).json(dataUrl);
    }

    async verifyCode (data: any, code: string, bool: boolean): Promise<any> {
        const user = await this.usersService.findOne(data.login);
        if (!user)
            return null;
        const isValid = authenticator.verify({ token: code, secret: user.twoFactorAuthSecret! });
        if (!isValid)
			return null;
        const payload: JwtPayload = {
            id: user.id,
            login: user.login,
            email: user.email,
			twoFa: true,
        };
        const token: string = this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expire,
        });
		let update = await this.usersService.updateStatus(user.login, UserStatus.ONLINE);
		if (!update)
			return null;
        return { token: token };
	}
}
