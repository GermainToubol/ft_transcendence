import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    @Get('intra')
    @UseGuards(AuthGuard('intra'))
    login(@Req() req: Request): any {
        return req.user;
    }
}
