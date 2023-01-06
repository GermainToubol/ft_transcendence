import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from './req-user.decorator';
import { UsersService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private usersService: UsersService) { }

	@Get('pseudo')
    @UseGuards(JwtAuthGuard)
    async validate(@ReqUser() user: string): Promise<string> {
        return this.usersService.getPseudo(user).then();
    }

	@Post('setpseudo')
	@UseGuards(JwtAuthGuard)
	async setPseudo(@ReqUser() user: any, @Body('pseudo') pseudo: string) {
		await this.usersService.setPseudo(user, pseudo).then()
	}
}