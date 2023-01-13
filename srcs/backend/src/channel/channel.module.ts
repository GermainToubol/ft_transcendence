import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Chatter } from '../chatter/chatter.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from './channel.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChannelEntity, Chatter])],
    providers: [ChannelService],
    controllers: [ChannelController]
})
export class ChannelModule { }
