import { Controller, Get, Param, ParseArrayPipe, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { GameHistory } from "./history.entity";

@Controller('history')
export class GameHistoryController {

  //     constructor(private usersService: UsersService) { }

	@Get(':pseudo')
  @UseGuards(JwtAuthGuard)
  async validate(@Param('pseudo') pseudo: string): Promise<any> {
    //return this.usersService.getHistory(pseudo).then();
    return 'coucou'
  }

}
