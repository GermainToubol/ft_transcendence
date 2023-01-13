import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatter } from 'src/chatter/chatter.entity';
import { Repository } from 'typeorm';
import { ChannelEntity } from './channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(ChannelEntity)
        private channelRepository: Repository<ChannelEntity>,
    ) { }

    async createChannel(chatter: Chatter, channelName: string, password: string) {
        const salt = await bcrypt.genSalt();
        let newChan: ChannelEntity = this.channelRepository.create();
        newChan.name = channelName;
        newChan.password = await bcrypt.hash(password, salt);
        newChan.owner = chatter;
        newChan.admins = [chatter];
        return await this.channelRepository.save(newChan);
    }

    async findChannelById(id: number, relations?: any): Promise<ChannelEntity> {
        if (typeof relations !== 'undefined')
            return this.channelRepository.findOne({
                where: { id: id },
                relations: relations,
            });
        return this.channelRepository.findOneBy({ id: id });
    }

    // Admin utilities
    // -----------------------------------------------------------------

    isChatterAdmin(chatter: Chatter, channel: ChannelEntity): boolean {
        if (channel.admins.findIndex((user) => user.id === chatter.id) === -1)
            return false;
        return true;
    }

    async addAdmin(chatter: Chatter, channel: ChannelEntity) {
        if (channel.admins.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.admins.push(chatter);
        return await this.channelRepository.save(channel);
    }

    async removeAdmin(chatter: Chatter, channel: ChannelEntity) {
        if (channel.admins.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        return await this.channelRepository.save(channel);
    }


    // Ban utilities
    // -----------------------------------------------------------------
    isChatterBanned(chatter: Chatter, channel: ChannelEntity): boolean {
        if (channel.bannedChatters.findIndex((user) => user.id === chatter.id) === -1)
            return false;
        return true;
    }

    async banChatter(chatter: Chatter, channel: ChannelEntity) {
        if (channel.bannedChatters.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.bannedChatters.push(chatter);
        return await this.channelRepository.save(channel);
    }

    async unbanChatters(chatter: Chatter, channel: ChannelEntity) {
        const index: number = channel.bannedChatters.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return;
        channel.bannedChatters.splice(index, 1);
        return await this.channelRepository.save(channel);
    }

    // Mute utilities
    // -----------------------------------------------------------------
    isChatterMuted(chatter: Chatter, channel: ChannelEntity): boolean {
        if (channel.mutedChatters.findIndex((user) => user.id === chatter.id) === -1)
            return false;
        return true;
    }

    async muteChatter(chatter: Chatter, channel: ChannelEntity) {
        if (channel.mutedChatters.findIndex((user) => user.id === chatter.id) !== -1)
            return;
        channel.mutedChatters.push(chatter);
        return await this.channelRepository.save(channel);
    }

    async unmuteChatters(chatter: Chatter, channel: ChannelEntity) {
        const index: number = channel.mutedChatters.findIndex((user) => user.id === chatter.id);
        if (index === -1)
            return;
        channel.mutedChatters.splice(index, 1);
        return await this.channelRepository.save(channel);
    }
}
