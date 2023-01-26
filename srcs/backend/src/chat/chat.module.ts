import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message/message.entity';
import { MessageService } from './message/message.service';
import { ChatChannel } from './channel/channel.entity';
import { ChatterService } from './chatter/chatter.service';
import { Chatter } from './chatter/chatter.entity';

@Module({
    providers: [ChatService, ChannelService, ChatGateway, MessageService, ChatterService],
    imports: [TypeOrmModule.forFeature([Message, ChatChannel, Chatter])],
    controllers: [ChatController]
})
export class ChatModule { }
