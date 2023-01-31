import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ReqUser } from "src/users/req-user.decorator";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/user.service";
import { GameHistory } from "./history.entity";

@Controller('history')
export class GameHistoryController {
    constructor(private usersService: UsersService) { }

	@Get()
    @UseGuards(JwtAuthGuard)
    async validate(@ReqUser() user: User): Promise<any> {
        return this.usersService.getHistory(user.login).then();
    }

}