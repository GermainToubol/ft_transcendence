import { Injectable } from '@nestjs/common';
import { ChannelService } from './channel/channel.service';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
    constructor(
        private channelService: ChannelService,
    ) { }

    async newMessage(content: string): Promise<Message> {
        return await this.channelService.create(content);
    }

    async getMessages(): Promise<Message[]> {
        return await this.channelService.findAllMessages();
    }

}
