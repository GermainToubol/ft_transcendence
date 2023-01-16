import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';

@Module({
    providers: [ChatService, ChannelService, ChatGateway],
    controllers: [ChatController]
})
export class ChatModule { }
