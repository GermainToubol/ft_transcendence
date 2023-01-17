import {
    Controller,
    Get,
    Query,
    Req,
	UseGuards
} from "@nestjs/common";
import axios from "axios";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { ReqUser } from "../users/req-user.decorator";
import { User } from "../users/user.entity";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('/login')
    async login(@Query('code') code: string, @Req() req: any): Promise<any> {
        const token: {access_token: string} = await axios.post('https://api.intra.42.fr/oauth/token', {
            grant_type: "authorization_code",
			client_id: process.env.API_UID,
            client_secret: process.env.API_SECRET,
            code: code,
            redirect_uri: process.env.FRONT_DOMAIN + '/callback',
            }).then((t) => t.data);
        const data: {data: any} = await axios.get('https://api.intra.42.fr/v2/me', {
                headers: { Authorization: `Bearer ${token.access_token}` },
            }).then((t) => t.data);
        return this.authService.login(data).then();
    }

	@Get('/validate')
    @UseGuards(JwtAuthGuard)
    async validate(@ReqUser() user: string): Promise<any> {
        return user;
    }

	@Get('/logout')
	@UseGuards(JwtAuthGuard)
	async logout(@ReqUser() user: User): Promise<any> {
		return await this.authService.logout(user);
	}
}