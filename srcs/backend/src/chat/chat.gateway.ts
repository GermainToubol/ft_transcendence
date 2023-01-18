import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChannelStatus } from './channel/channel.entity';
import { ChatService } from './chat.service';

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

    @SubscribeMessage("sendMsg")
    async handleMessage(client: Socket, payload: any) {
        const channel = await this.chatService.getChannelById(payload.channel);
        if (!channel)
            return;
        let message = await this.chatService.newMessage(payload.content, channel);
        if (!message)
            return;
        message.channel = channel
        this.server.emit('recMsg', message);
    }

    @SubscribeMessage("addChan")
    async handleChannelCreation(client: Socket, payload: any) {
        const channel = await this.chatService.createChannel(payload.channelName, payload.channelLevel);
        if (!channel)
            return;
        client.join(`${channel.id}`);
        if (payload.channelLevel == ChannelStatus.Private)
            this.server.to(`${channel.id}`).emit('updateChan', channel);
        else
            this.server.emit('updateChan', channel);
    }
}
