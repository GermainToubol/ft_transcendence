import { Controller, Get, Res } from '@nestjs/common';
import { Response } from "express";
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Get()
    async chat(@Res() res: Response) {
        const messages = await this.chatService.getMessages();
        console.log("asked for messages")
        res.json(messages);
    }
}
