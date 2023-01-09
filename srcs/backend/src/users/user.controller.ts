import { BadRequestException, Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from './req-user.decorator';
import { UsersService } from './user.service';
import LocalFilesInterceptor from "../localfiles/localFiles.interceptor";

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

	@Post('avatar')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(LocalFilesInterceptor({
		fieldName: 'file',
		path: '/avatar',
		fileFilter: (request, file, callback) => {
			if (!file.mimetype.includes('image')) {
			  return callback(new BadRequestException('Provide a valid image'), false);
			}
			callback(null, true);
		  },
		  limits: {
			fileSize: Math.pow(1024, 2) // 1MB
		  }
	}))
	async setAvatar(@ReqUser() user: any, @UploadedFile() file: Express.Multer.File) {
		console.log("TEST")
		return this.usersService.addAvatar(user, {
			path: file.path,
			filename: file.originalname,
			mimetype: file.mimetype
		  });
	}
}