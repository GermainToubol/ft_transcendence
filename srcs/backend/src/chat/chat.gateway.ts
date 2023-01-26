import { createParamDecorator, ExecutionContext, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuardWs } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import { ChannelStatus } from './channel/channel.entity';
import { ChatService } from './chat.service';
import { MessageExceptionFilter } from './message/message.filter';
import { ChatChannelDto } from './types/channel.dto';
import { ChatMessageDto } from './types/message.dto';
import { UserSocket } from './usersocket.adapter';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseGuards(JwtAuthGuardWs)
@WebSocketGateway({ cors: { origin: "*" }, path: '/chatsocket' })
export class ChatGateway {
    constructor(private chatService: ChatService, private usersService: UsersService) { }

    @WebSocketServer() server: Server;

    handleConnection(client: UserSocket) {
        console.log(`connection: ${client.id}`);
        console.log(client.handshake.auth)
    }

    handleDisconnect(client: UserSocket) {
        console.log(`disconnection: ${client.id}`);
    }

    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: UserSocket, payload: ChatMessageDto,) {
        const user: User = await this.usersService.findOne(client.userLogin);
        const channel = await this.chatService.getChannelById(payload.channel);

        console.log(client.userLogin)
        console.log(user)
        if (!channel)
            return;
        let message = await this.chatService.newMessage(payload.content, channel);
        if (!message)
            return;
        message.channel = channel
        if (channel.channelStatus == ChannelStatus.Public)
            this.server.emit('recvMessage', message);
        else
            this.server.to(`channel${channel.id}`).emit('recvMessage', message)
    }


    @UseFilters(new MessageExceptionFilter("Invalid channel creation"))
    @SubscribeMessage("addChannel")
    async handleChannelCreation(client: UserSocket, payload: ChatChannelDto) {
        const channel = await this.chatService.createChannel(
            payload.channelName,
            payload.channelLevel);
        if (!channel)
            return;
        client.join(`channel${channel.id}`);
        if (payload.channelLevel == ChannelStatus.Private)
            this.server.to(`channel${channel.id}`).emit('updateChannel', channel);
        else
            this.server.emit('updateChannel', channel);
    }
}
