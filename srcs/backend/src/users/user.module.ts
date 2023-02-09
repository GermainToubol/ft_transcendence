import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import LocalFilesService from 'src/localfiles/localFiles.service';
import LocalFile from 'src/localfiles/localFile.entity';
import { LocalFileModule } from 'src/localfiles/localFiles.module';
import { ChatterModule } from 'src/chatter/chatter.module';
import { GameHistoryModule } from 'src/history/history.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    UsersService,
    LocalFilesService,
    JwtService
  ],
  imports: [
    TypeOrmModule.forFeature([
      User,
      LocalFile,
    ]),
    LocalFileModule,
    ChatterModule,
    GameHistoryModule
  ],
  controllers: [
    UserController,
  ],
  exports: [
    UsersService,
  ],
})
export class UsersModule { }
