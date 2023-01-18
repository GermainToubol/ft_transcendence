import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from "express";
import { ChatService } from './chat.service';
import { Message } from './message/message.entity';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) { }

    @Get()
    async findChannels(@Res() res: Response) {
        const channels = await this.chatService.getChannels();
        console.log("asked for channels")
        res.json(channels);
    }

    @Get(':id')
    async findChannelMessages(
        @Res() res: Response,
        @Param('id') chanId: number) {
        const channel = await this.chatService.getChannelById(chanId);
        const messages = await this.chatService.getMessages(channel);
        res.json(messages)
    }
}
