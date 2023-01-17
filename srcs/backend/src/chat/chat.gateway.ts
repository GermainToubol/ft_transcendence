import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: "*" }, path: '/chat' })
export class ChatGateway {
    constructor(private chatService: ChatService) { }

    @WebSocketServer() server: Server;

    handleConnection(client: Socket) {
        client.join("tagada-room")
        console.log(`connection: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`disconnection: ${client.id}`);
    }

    @SubscribeMessage("sendMsg")
    async handleMessage(client: Socket, payload: string) {
        const message = await this.chatService.newMessage(payload);
        this.server.to("tagada-room").emit('recMsg', message);
    }
}
