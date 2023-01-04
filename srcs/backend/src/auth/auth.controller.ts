import {
    Controller,
    Get,
    HttpCode,
    Req,
    Res, UseGuards
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { IntraAuthGuard } from "./guards/intra-auth.guard";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    /* Route: OAuth42 
        http://${host}:${port}/auth/
    */
    @Get()
    @HttpCode(200)
    @UseGuards(IntraAuthGuard)
    login(@Req() req: any, @Res() res: any) {
		const tst = this.authService.login(req, res);
		console.log(tst);
        return tst;
    }

    /* Route: get the user who logged in 
        http://${host}:${port}/auth/profile
    */
    @Get('/profile')
    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any): Promise<any> {
		console.log(req.user);
        return req.user;
    }
}