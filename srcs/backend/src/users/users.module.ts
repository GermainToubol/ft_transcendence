import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [UsersService, ConfigService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
