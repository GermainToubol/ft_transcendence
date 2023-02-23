import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import LocalFile from "src/localfiles/localFile.entity";
import LocalFilesService from "src/localfiles/localFiles.service";
import { User } from "src/users/user.entity";
import { UsersService } from "src/users/user.service";
import { GameHistoryController } from "./history.controller";
import { GameHistory } from "./history.entity";
import { GameHistoryService } from "./history.service";

@Module({
    providers: [GameHistoryService ],
    imports: [TypeOrmModule.forFeature([GameHistory])],
  controllers: [ GameHistoryController ],
  exports: [GameHistoryService]
  })
export class GameHistoryModule {}
