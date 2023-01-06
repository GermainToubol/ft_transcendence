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

dotenv.config();
@Injectable()
export class TwoFactorAuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private configService: ConfigService,
    ) { }

    /* method used for changing 2fa bool */
    async enableDisableTwoFactorAuth(userId: number, bool: boolean) {
        return this.usersService.turnOnOffTwoFactorAuth(userId, bool);
    }

    //*  All the new change will be here
    //* code:
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
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const isValid = authenticator.verify({
            token: code,
            secret: user.twoFactorAuthSecret!,
        });
        if (!isValid) {
            throw new UnauthorizedException('Invalid code.')
        }
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
        return {
            token: token};// redirect to Home page
    }
    //* end
}