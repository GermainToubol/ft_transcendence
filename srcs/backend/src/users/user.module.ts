import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import LocalFilesService from 'src/localfiles/localFiles.service';
import LocalFile from 'src/localfiles/localFile.entity';

@Module({
  providers: [UsersService, LocalFilesService],
  imports: [TypeOrmModule.forFeature([User]), TypeOrmModule.forFeature([LocalFile])],
  controllers: [
	UserController,
],
})
export class UsersModule {}
