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

    @Post('first-verify')
    @UseGuards(JwtAuthGuard)
    verifyFirstTime(
        @ReqUser() user: User,
        @Body('code') code: string,
    ): Promise<any> {
        return this.twoFactorAuthService.verifyCode(user.login, code, false);
    }

    @Post('verify')
	@UseGuards(JwtLoginAuthGuard)
    verifyLogin(
        @Body('key') key: string,
        @Body('code') code: string,
    ): Promise<any> {
        console.log(code)
        console.log(key)
        return this.twoFactorAuthService.verifyCode(key, code, true);
    }
} 