import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { Room } from "./room.entity";
import { GameController } from "./game.controller";
import { GameGateway } from "./game.gateway";
import { GameService } from "./game.service";
import { LobbyService } from "./lobby.service";


@Module({
	imports: [TypeOrmModule.forFeature([Room]), AuthModule],
	controllers: [GameController],
	providers: [GameGateway, LobbyService, GameService],
})

export class GameModule {}