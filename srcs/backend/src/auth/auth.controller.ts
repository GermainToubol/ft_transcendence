import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('intra')
    @UseGuards(AuthGuard('intra'))
    login(@Req() req: Request): any {
        return this.authService.login(req.user);
    }

}
