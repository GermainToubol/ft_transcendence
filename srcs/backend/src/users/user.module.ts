import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import LocalFilesService from 'src/localfiles/localFiles.service';
import LocalFile from 'src/localfiles/localFile.entity';
import { Chatter } from '../chatter/chatter.entity';

@Module({
    providers: [UsersService, LocalFilesService],
    imports: [TypeOrmModule.forFeature([User, LocalFile, Chatter])],
    controllers: [
        UserController,
    ],
})
export class UsersModule { }
