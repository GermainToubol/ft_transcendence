import { Injectable } from '@nestjs/common';
import { ChannelStatus, ChatChannel } from './channel/channel.entity';
import { ChannelService } from './channel/channel.service';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
    constructor(
        private channelService: ChannelService,
    ) { }

    async getChannels(): Promise<ChatChannel[]> {
        return await this.channelService.getChannelList();
    }

    async getChannelById(id: number): Promise<ChatChannel> {
        return await this.channelService.getChannelById(id);
    }

    async newMessage(content: string, channel: ChatChannel): Promise<Message> {
        return await this.channelService.postMessage(content, channel);
    }

    async getMessages(channel: ChatChannel): Promise<Message[]> {
        return await this.channelService.getChannelMessages(channel);
    }

    async createChannel(channelName: string, channelLevel: ChannelStatus): Promise<ChatChannel> {
        return await this.channelService.createChannel(channelName, channelLevel);
    }
}
