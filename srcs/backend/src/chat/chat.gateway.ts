import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
    @SubscribeMessage('sendMessage')
    handleEvent(@MessageBody() data: string): string {
        return data;
    }
}
