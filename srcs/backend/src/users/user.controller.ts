import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ReqUser } from './req-user.decorator'
import { UsersService } from './user.service'
import LocalFilesInterceptor from "../localfiles/localFiles.interceptor"

@Controller('user')
export class UserController {
    constructor(private usersService: UsersService) { }

	@Get('pseudo')
    @UseGuards(JwtAuthGuard)
    async validate(@ReqUser() user: string): Promise<string> {
        return await this.usersService.getPseudo(user).then()
    }

	@Get('/info/:pseudo')
    @UseGuards(JwtAuthGuard)
    async getInfo(@Param('pseudo') pseudo: string): Promise<string> {
        return await this.usersService.getInfo(pseudo).then()
    }

	@Get('/history/:pseudo')
    @UseGuards(JwtAuthGuard)
    async getHistory(@Param('pseudo') pseudo: string): Promise<string> {
        return await this.usersService.getHistory(pseudo).then()
    }

	@Get('leaderboard')
    @UseGuards(JwtAuthGuard)
    async getLeaderboard(): Promise<any> {
        return await this.usersService.getLeaderboard().then();
    }

	@Get('friends')
    @UseGuards(JwtAuthGuard)
    async getFriends(@ReqUser() user: any): Promise<any> {
        return await this.usersService.getFriends(user).then()
    }

	@Get('invitations')
    @UseGuards(JwtAuthGuard)
    async getInvitations(@ReqUser() user: any): Promise<any> {
        return await this.usersService.getInvitations(user).then()
    }

	@Post('setpseudo')
	@UseGuards(JwtAuthGuard)
	async setPseudo(@ReqUser() user: any, @Body('pseudo') pseudo: string) {
		return await this.usersService.setPseudo(user, pseudo).then()
	}

	@Post('addfriend')
	@UseGuards(JwtAuthGuard)
	async addFriend(@ReqUser() user: any, @Body('pseudo') pseudo: string): Promise<string> {
		return await this.usersService.addFriend(user, pseudo).then()
	}

	@Post('removefriend')
	@UseGuards(JwtAuthGuard)
	async removeFriend(@ReqUser() user: any, @Body('pseudo') pseudo: string){
		await this.usersService.removeFriend(user, pseudo).then()
	}

	@Post('acceptfriend')
	@UseGuards(JwtAuthGuard)
	async acceptFriend(@ReqUser() user: any, @Body('pseudo') pseudo: string){
		await this.usersService.acceptFriend(user, pseudo).then()
	}

	@Post('declinefriend')
	@UseGuards(JwtAuthGuard)
	async declineFriend(@ReqUser() user: any, @Body('pseudo') pseudo: string) {
		await this.usersService.declineFriend(user, pseudo).then()
	}

	@Post('avatar')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(LocalFilesInterceptor({
		fieldName: 'file',
		path: '/avatar',
		fileFilter: (request, file, callback) => {
			if (!file.mimetype.includes('image')) {
			  return callback(new BadRequestException('Provide a valid image'), false)
			}
			callback(null, true)
		  },
		  limits: {
			fileSize: Math.pow(1024, 2) // 1MB
		  }
	}))
	async setAvatar(@ReqUser() user: any, @UploadedFile() file: Express.Multer.File) {
		return this.usersService.addAvatar(user, {
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		  })
	}
}
