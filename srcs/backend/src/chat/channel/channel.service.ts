import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelStatus, ChatChannel } from './channel.entity';
import { Message } from '../message/message.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(ChatChannel)
        private channelRepository: Repository<ChatChannel>,
        private messageService: MessageService) { }

    async createChannel(
        channelName: string,
        channelStatus: ChannelStatus): Promise<ChatChannel> {
        let channel = this.channelRepository.create()
        channel.channelName = channelName;
        channel.channelStatus = channelStatus;
        return await this.channelRepository.save(channel);
    }

    async getChannelList(): Promise<ChatChannel[]> {
        return await this.channelRepository.find();
    }

    async getChannelById(id: number): Promise<ChatChannel> {
        return this.channelRepository.findOneBy({ id: id });
    }

    async getChannelMessages(channel: ChatChannel): Promise<Message[]> {
        return await this.messageService.findMessageChannel(channel);
    }

    async postMessage(content: string, channel: ChatChannel): Promise<Message> {
        return await this.messageService.create(content, channel);
    }
}
