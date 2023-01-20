import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelStatus } from './channel/channel.entity';
import { ChatService } from './chat.service';
import { MessageExceptionFilter } from './message/message.filter';
import { ChatChannelDto } from './types/channel.dto';
import { ChatMessageDto } from './types/message.dto';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@WebSocketGateway({ cors: { origin: "*" }, path: '/chatsocket' })
export class ChatGateway {
    constructor(private chatService: ChatService) { }

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        console.log(`connection: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`disconnection: ${client.id}`);
    }

    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: Socket, payload: ChatMessageDto) {
        const channel = await this.chatService.getChannelById(payload.channel);
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
    async handleChannelCreation(client: Socket, payload: ChatChannelDto) {
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
