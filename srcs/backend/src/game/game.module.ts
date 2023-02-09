import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AuthModule } from "src/auth/auth.module"
import { Room } from "./room.entity"
import { GameController } from "./game.controller"
import { GameGateway } from "./game.gateway"
import { GameService } from "./game.service"
import { LobbyService } from "./lobby.service"
import { User } from "src/users/user.entity"
import { JwtModule, JwtService } from "@nestjs/jwt"
import LocalFile from "src/localfiles/localFile.entity"
import { GameHistory } from "src/history/history.entity"
import { UsersModule } from "src/users/user.module"
import { GameHistoryModule } from "src/history/history.module"
import { LocalFileModule } from "src/localfiles/localFiles.module"

@Module({
	imports: [TypeOrmModule.forFeature([Room, User, LocalFile, GameHistory]), AuthModule, UsersModule, GameHistoryModule, LocalFileModule, JwtModule],
	controllers: [GameController],
	providers: [GameGateway, LobbyService, GameService, JwtService],
})

export class GameModule {}
