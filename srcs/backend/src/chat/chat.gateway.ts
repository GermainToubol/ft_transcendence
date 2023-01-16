import { WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: "*" }, path: '/chat' })
export class ChatGateway {
    handleConnection(client: Socket) {
        console.log(`connection: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`disconnection: ${client.id}`);
    }
}
