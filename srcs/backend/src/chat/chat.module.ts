import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './channel/message.entity';

@Module({
    providers: [ChatService, ChannelService, ChatGateway],
    imports: [TypeOrmModule.forFeature([Message])],
    controllers: [ChatController]
})
export class ChatModule { }
