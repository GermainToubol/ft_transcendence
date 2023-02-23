import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChannelService } from './channel/channel.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message/message.entity';
import { MessageService } from './message/message.service';
import { ChatChannel } from './channel/channel.entity';
import { UsersModule } from 'src/users/user.module';
import { ChatterModule } from 'src/chatter/chatter.module';


@Module({
    providers: [
        ChatService,
        ChannelService,
        ChatGateway,
        MessageService
    ],
    imports: [
        TypeOrmModule.forFeature([
            Message,
            ChatChannel
        ]),
        UsersModule,
        ChatterModule
    ],
    controllers: [
        ChatController,
    ]
})
export class ChatModule { }
