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
import { UsersModule } from 'src/users/user.module';
import { UsersService } from 'src/users/user.service';
import { User } from 'src/users/user.entity';
import LocalFilesService from 'src/localfiles/localFiles.service';
import LocalFile from 'src/localfiles/localFile.entity';

@Module({
    providers: [ChatService, ChannelService, ChatGateway, MessageService, ChatterService],
    imports: [
        TypeOrmModule.forFeature([
            Message, ChatChannel, Chatter, User, LocalFile]),
        UsersModule],
    controllers: [ChatController]
})
export class ChatModule { }
