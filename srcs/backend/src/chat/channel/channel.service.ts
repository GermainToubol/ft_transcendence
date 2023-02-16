import { Injectable } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelStatus, ChatChannel } from './channel.entity';
import { Message } from '../message/message.entity';
import { Chatter } from 'src/chatter/chatter.entity';
import * as bcrypt from "bcrypt";

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
        return this.channelRepository.save(channel);
    }

    async setChannelOwner(
        owner: Chatter,
        channel: ChatChannel): Promise<ChatChannel> {
        channel.owner = owner;
        channel.channelAdmins = [owner];
        return this.channelRepository.save(channel);
    }

    async getChannelList(opts?: any): Promise<ChatChannel[]> {
        if (opts !== undefined)
            return this.channelRepository.find(opts)
        return this.channelRepository.find();
    }

    async getChannelById(id: number, opts?: any): Promise<ChatChannel> {
        if (opts !== undefined)
            return this.channelRepository.findOne({
                where: {
                    id: id,
                },
                relations: opts,
            });
        return this.channelRepository.findOneBy({ id: id });
    }

    async getChannelMessages(channel: ChatChannel): Promise<Message[]> {
        return this.messageService.findMessageChannel(channel);
    }

    async postMessage(content: string, channel: ChatChannel, chatter: Chatter): Promise<Message> {
        return this.messageService.create(content, channel, chatter);
    }

    async setAdminFromChannel(chatter: Chatter, channel: ChatChannel): Promise<ChatChannel> {
        if (channel.channelAdmins.findIndex((user) => user.id === chatter.id) !== -1)
            return null
        channel.channelAdmins.push(chatter);
        await this.channelRepository.save(channel);
    }

    async unsetAdminFromChannel(chatter: Chatter, channel: ChatChannel): Promise<ChatChannel> {
        const index: number = channel.channelAdmins.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return null
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

    async muteChatterFromChannel(chatter: Chatter, channel: ChatChannel) {
        if (channel.mutedUsers.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.mutedUsers.push(chatter);
        await this.channelRepository.save(channel);
    }

    async unmuteChatterFromChannel(chatter: Chatter, channel: ChatChannel) {
        const index: number = channel.mutedUsers.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return;
        channel.mutedUsers.splice(index, 1);
        await this.channelRepository.save(channel);
    }

    isChatterMutedFromChannel(chatter: Chatter, channel: ChatChannel): boolean {
        const index: number = channel.mutedUsers.findIndex((user) => user.id === chatter.id);
        return index !== -1;
    }

    isChannelUser(user: Chatter, channel: ChatChannel): boolean {
        if (channel.channelStatus == ChannelStatus.Public
            || channel.channelUsers.findIndex((chatter) => chatter.id == user.id) != -1)
            return true;
        return false;
    }

    async addChannelUser(user: Chatter, password: string, channel: ChatChannel): Promise<boolean> {
        let isMatch: boolean;
        if (channel.password)
            isMatch = await bcrypt.compare(password, channel.password);
        else
            isMatch = (password === "")
        if (!isMatch && channel.channelStatus === ChannelStatus.Protected)
            return false;
        channel.channelUsers.push(user);
        await this.channelRepository.save(channel);
        return true;
    }

    async leaveChannel(user: Chatter, channel: ChatChannel): Promise<boolean> {
        if (user.id == channel.owner.id || channel.channelStatus == ChannelStatus.Public || channel.channelStatus == ChannelStatus.Locked) {
            return false;
        }
        const index = channel.channelUsers.findIndex((chatter) => chatter.id == user.id)
        if (index == -1)
            return false;
        channel.channelUsers.splice(index, 1);
        await this.channelRepository.save(channel);
        return true;
    }

    async setChannelPassword(password: string, channel: ChatChannel) {
        let hash: string;
        const salt = await bcrypt.genSalt();;
        if (password === "")
            hash = null;
        hash = await bcrypt.hash(password, salt);
        channel.password = hash;
        await this.channelRepository.save(channel);
    }
}
