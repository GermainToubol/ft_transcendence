import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Room } from "./room.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { LobbyService } from "./lobby.service";
import { UsersService } from "src/users/user.service";
import { User } from "src/users/user.entity";
import { JwtService } from "@nestjs/jwt";
import LocalFile from "src/localfiles/localFile.entity";
import LocalFilesService from "src/localfiles/localFiles.service";
import { GameHistory } from "src/history/history.entity";
import { GameHistoryService } from "src/history/history.service";

@Module({
	imports: [TypeOrmModule.forFeature([Room, User, LocalFile, GameHistory]), AuthModule],
	controllers: [GameController],
	providers: [GameGateway, LobbyService, GameService, UsersService, JwtService, LocalFilesService, GameHistoryService],
})

export class GameModule {}