import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from "express";
import { ChatService } from './chat.service';
import { Message, SendMessage } from './message/message.entity';

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
        const messages: Message[] = await this.chatService.getMessages(channel);
        const sendMessages: SendMessage[] = messages.map(
            function(msg: Message): SendMessage {
                return {
                    id: msg.id,
                    content: msg.content,
                    channel: msg.channel,
                    authorLogin: msg.author.user.login,
                    authorUsername: msg.author.user.usual_full_name,
                };
            })
        res.json(sendMessages)
    }
}
