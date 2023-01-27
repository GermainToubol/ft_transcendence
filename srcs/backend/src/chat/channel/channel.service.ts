import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelStatus, ChatChannel } from './channel.entity';
import { Message } from '../message/message.entity';
import { Chatter } from 'src/chatter/chatter.entity';

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

    async getChannelList(opts?: any): Promise<ChatChannel[]> {
        if (opts !== 'undefined')
            return await this.channelRepository.find(opts)
        return await this.channelRepository.find();
    }

    async getChannelById(id: number, opts?: any): Promise<ChatChannel> {
        if (opts !== 'undefined')
            return await this.channelRepository.findOne({
                where: {
                    id: id,
                },
                relations: opts,
            });
        return await this.channelRepository.findOneBy({ id: id });
    }

    async getChannelMessages(channel: ChatChannel): Promise<Message[]> {
        return await this.messageService.findMessageChannel(channel);
    }

    async postMessage(content: string, channel: ChatChannel, chatter: Chatter): Promise<Message> {
        return await this.messageService.create(content, channel, chatter);
    }

    async setAdminFromChannel(chatter: Chatter, channel: ChatChannel) {
        if (channel.channelAdmins.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.channelAdmins.push(chatter);
        await this.channelRepository.save(channel);
    }

    async unsetAdminFromChannel(chatter: Chatter, channel: ChatChannel) {
        const index: number = channel.channelAdmins.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return;
        channel.channelAdmins.splice(index, 1);
        await this.channelRepository.save(channel);
    }

    isChatterAdminFromChannel(chatter: Chatter, channel: ChatChannel): boolean {
        const index: number = channel.channelAdmins.findIndex((user) => user.id === chatter.id);
        return index !== -1;
    }

    async banChatterFromChannel(chatter: Chatter, channel: ChatChannel) {
        if (channel.bannedUsers.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.bannedUsers.push(chatter);
        await this.channelRepository.save(channel);
    }

    async unbanChatterFromChannel(chatter: Chatter, channel: ChatChannel) {
        const index: number = channel.bannedUsers.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return;
        channel.bannedUsers.splice(index, 1);
        await this.channelRepository.save(channel);
    }

    isChatterBannedFromChannel(chatter: Chatter, channel: ChatChannel): boolean {
        const index: number = channel.bannedUsers.findIndex((user) => user.id === chatter.id);
        return index !== -1;
    }
}
