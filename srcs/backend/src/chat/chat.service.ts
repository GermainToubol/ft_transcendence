import { Injectable } from '@nestjs/common';
import { Chatter } from 'src/chatter/chatter.entity';
import { ChannelStatus, ChatChannel } from './channel/channel.entity';
import { ChannelService } from './channel/channel.service';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
    constructor(
        private channelService: ChannelService,
    ) { }

    async getChannels(opts?: any): Promise<ChatChannel[]> {
        return await this.channelService.getChannelList(opts);
    }

    async getChannelById(id: number, opts?: any): Promise<ChatChannel> {
        return await this.channelService.getChannelById(id, opts);
    }

    async newMessage(content: string, channel: ChatChannel, chatter: Chatter): Promise<Message> {
        return await this.channelService.postMessage(content, channel, chatter);
    }

    async getMessages(channel: ChatChannel): Promise<Message[]> {
        return await this.channelService.getChannelMessages(channel);
    }

    async createChannel(channelName: string, channelLevel: ChannelStatus, password: string, owner: Chatter): Promise<ChatChannel> {
        let channel = await this.channelService.createChannel(channelName, channelLevel);
        console.log("aa", password)
        await this.channelService.setChannelPassword(password, channel);
        console.log("bb", channel)
        return await this.channelService.setChannelOwner(owner, channel);
    }

    isChannelUser(user: Chatter, channel: ChatChannel): boolean {
        return this.channelService.isChannelUser(user, channel);
    }

    async addChannelUser(user: Chatter, password: string, channelId: number): Promise<boolean> {
        const channel = await this.getChannelById(
            channelId,
            { channelUsers: true });
        return await this.channelService.addChannelUser(user, password, channel);
    }

    async addChannelPassword(user: Chatter, password: string, channelId: number): Promise<boolean> {
        const channel = await this.getChannelById(channelId, { owner: true });
        if (user.id == channel.owner.id) {
            this.channelService.setChannelPassword(password, channel);
            return true;
        }
        return false;
    }

    async banChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number): Promise<boolean> {
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel)) {
            this.channelService.banChatterFromChannel(banned, channel);
            return true;
        }
        return false;
    }

    async unbanChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number): Promise<boolean> {
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel)) {
            this.channelService.unbanChatterFromChannel(banned, channel);
            return true;
        }
        return false;
    }

    isBannedFromChannel(user: Chatter, channel: ChatChannel): boolean {
        return this.channelService.isChatterBannedFromChannel(user, channel);
    }

    async adminChatterFromChannel(admin: Chatter, newadmin: Chatter, channelId: number): Promise<boolean> {
        const channel = await this.getChannelById(
            channelId,
            { channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel)) {
            this.channelService.setAdminFromChannel(newadmin, channel);
            return true;
        }
        return false;
    }

    async unadminChatterFromChannel(admin: Chatter, oldadmin: Chatter, channelId: number): Promise<boolean> {
        console.log("ask for unadmin")
        const channel = await this.getChannelById(
            channelId,
            { channelAdmins: true, owner: true });
        console.log(channel)
        if (this.channelService.isChatterAdminFromChannel(admin, channel)
            && oldadmin.id !== channel.owner.id) {
            this.channelService.unsetAdminFromChannel(oldadmin, channel);
            return true;
        }
        return false;
    }

    isMutedFromChannel(user: Chatter, channel: ChatChannel): boolean {
        return this.channelService.isChatterMutedFromChannel(user, channel);
    }

    async muteChatterFromChannel(admin: Chatter, user: Chatter, channelId: number) {
        const channel = await this.getChannelById(
            channelId,
            { channelAdmins: true, mutedUsers: true })
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.muteChatterFromChannel(user, channel);
    }

    async unmuteChatterFromChannel(admin: Chatter, user: Chatter, channelId: number) {
        const channel = await this.getChannelById(
            channelId,
            { channelAdmins: true, mutedUsers: true })
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.unmuteChatterFromChannel(user, channel);
    }
}
