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

    async getChannels(): Promise<ChatChannel[]> {
        return await this.channelService.getChannelList();
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

    async createChannel(channelName: string, channelLevel: ChannelStatus): Promise<ChatChannel> {
        return await this.channelService.createChannel(channelName, channelLevel);
    }

    async banChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number) {
        console.log(admin)
        console.log("ask for ban")
        console.log(banned)
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.banChatterFromChannel(banned, channel);
    }

    async unbanChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number) {
        console.log(admin)
        console.log("ask for unban")
        console.log(banned)
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.unbanChatterFromChannel(banned, channel);
    }

    async adminChatterFromChannel(admin: Chatter, newadmin: Chatter, channelId: number) {
        console.log("ask for admin")
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        //if (this.channelService.isChatterAdminFromChannel(admin, channel))
        this.channelService.setAdminFromChannel(newadmin, channel);
    }

    async unadminChatterFromChannel(admin: Chatter, oldadmin: Chatter, channelId: number) {
        console.log("ask for unadmin")
        const channel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        //if (this.channelService.isChatterAdminFromChannel(admin, channel))
        this.channelService.unsetAdminFromChannel(oldadmin, channel);
    }
}
