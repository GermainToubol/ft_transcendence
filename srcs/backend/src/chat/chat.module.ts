import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelEntity } from 'src/channel/channel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { Chatter } from 'src/chatter/chatter.entity';
import { ChatterModule } from 'src/chatter/chatter.module';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/user.module';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Module({
    imports: [
        ChatterModule,
        ChannelModule,
        TypeOrmModule.forFeature([
            User,
            Chatter,
            ChannelEntity, Message]),
        UsersModule,
    ],
    providers: [ChatService, ChatGateway]
})
export class ChatModule { }
