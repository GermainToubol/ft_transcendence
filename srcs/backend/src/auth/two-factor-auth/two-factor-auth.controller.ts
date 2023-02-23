import { Body, Controller, Get, Post, Res, UseGuards} from "@nestjs/common";
import { Response } from "express";
import { ReqUser } from "../../users/req-user.decorator";
import { User } from "../../users/user.entity";
import { JwtAuthGuard, JwtLoginAuthGuard } from "../guards/jwt-auth.guard";
import { TwoFactorAuthService } from "./two-factor-auth.service";

@Controller('2fa')
export class TwoFactorAuthController {
    constructor(
        private readonly twoFactorAuthService: TwoFactorAuthService,
    ) { }

    @Get('enable')
    @UseGuards(JwtAuthGuard)
    enableTwoFactorAuth(@ReqUser() user: User) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(user.id), true);
    }

    @Get('disable')
    @UseGuards(JwtAuthGuard)
    disableTwoFactorAuth(@ReqUser() user: User) {
        return this.twoFactorAuthService.enableDisableTwoFactorAuth(Number(user.id), false);
    }

    @Get('generate')
    @UseGuards(JwtAuthGuard)
    sendEmail(
        @ReqUser() user: User,
        @Res() res: Response): Promise<any> {
        return this.twoFactorAuthService.generateTwoFactorAuthSecretAndQRCode(user, res);
    }

    @Post('verify')
	@UseGuards(JwtLoginAuthGuard)
    verifyLogin(@ReqUser() user: string, @Body('code') code: string): Promise<any> {
        return this.twoFactorAuthService.verifyCode(user, code, true);
    }
}