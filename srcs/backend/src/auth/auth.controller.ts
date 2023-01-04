import {
    Controller,
    Get,
    Req,
	UseGuards
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
    @UseGuards(IntraAuthGuard)
    login(@Req() req: any) {
        return this.authService.login(req).then();
    }

    /* Route: get the user who logged in 
        http://${host}:${port}/auth/profile
    */
    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: any): Promise<any> {
        return req.user;
    }
}