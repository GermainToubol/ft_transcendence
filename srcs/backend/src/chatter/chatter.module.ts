import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatter } from './chatter.entity';
import { ChatterService } from './chatter.service';
import { ChatterController } from './chatter.controller';
import { ChannelEntity } from 'src/channel/channel.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Chatter, ChannelEntity])],
    providers: [ChatterService],
    controllers: [ChatterController],
})

export class ChatterModule { }
