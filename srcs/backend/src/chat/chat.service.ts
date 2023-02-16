import { Injectable } from '@nestjs/common';
import { Chatter } from 'src/chatter/chatter.entity';
import { ChatterService } from 'src/chatter/chatter.service';
import { ChannelStatus, ChatChannel } from './channel/channel.entity';
import { ChannelService } from './channel/channel.service';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
    constructor(
        private channelService: ChannelService,
        private chatterService: ChatterService,
    ) { }

    async getChannels(opts?: any): Promise<ChatChannel[]> {
        return this.channelService.getChannelList(opts);
    }

    async getChannelById(id: number, opts?: any): Promise<ChatChannel> {
        return this.channelService.getChannelById(id, opts);
    }

    async newMessage(content: string, channel: ChatChannel, chatter: Chatter): Promise<Message> {
        return this.channelService.postMessage(content, channel, chatter);
    }

    async getMessages(channel: ChatChannel): Promise<Message[]> {
        return this.channelService.getChannelMessages(channel);
    }

    async createChannel(channelName: string, channelLevel: ChannelStatus, password: string, owner: Chatter): Promise<ChatChannel> {
        let channel: ChatChannel = await this.channelService
            .createChannel(channelName, channelLevel)
            .catch(() => null)
        if (!channel || channelLevel === ChannelStatus.Locked) {
            return channel
        }
        await this.channelService.setChannelPassword(password, channel);
        return this.channelService.setChannelOwner(owner, channel);
    }

    isChannelUser(user: Chatter, channel: ChatChannel): boolean {
        return this.channelService.isChannelUser(user, channel);
    }

    async addChannelUser(user: Chatter, password: string, channelId: number, opt?: boolean): Promise<boolean> {
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { channelUsers: true, invitedUsers: true })
            .catch(() => null)
        if (!channel)
            return false
        if (channel.channelStatus === ChannelStatus.Private
            && (opt === undefined || opt === false)
            && channel.invitedUsers.findIndex((usr) => user.id === usr.id) === -1) {
            return false
        }
        if (channel.channelStatus === ChannelStatus.Locked
            && (opt === undefined || opt === false))
            return false
        return this.channelService.addChannelUser(user, password, channel)
    }

    async leaveChannel(user: Chatter, channelId: number): Promise<boolean> {
        const channel: ChatChannel = await this.channelService
            .getChannelById(channelId, { channelUsers: true, owner: true })
            .catch(() => null)
        if (!channel)
            return false
        return this.channelService.leaveChannel(user, channel)
    }

    async addChannelPassword(user: Chatter, password: string, channelId: number): Promise<boolean> {
        const channel: ChatChannel = await this.getChannelById(channelId, { owner: true })
        if (user.id == channel.owner.id) {
            this.channelService.setChannelPassword(password, channel);
            return true;
        }
        return false;
    }

    async banChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number): Promise<boolean> {
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { bannedUsers: true, channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel)) {
            this.channelService.banChatterFromChannel(banned, channel);
            return true;
        }
        return false;
    }

    async unbanChatterFromChannel(admin: Chatter, banned: Chatter, channelId: number): Promise<boolean> {
        const channel: ChatChannel = await this.getChannelById(
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
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { channelAdmins: true });
        if (this.channelService.isChatterAdminFromChannel(admin, channel)) {
            this.channelService.setAdminFromChannel(newadmin, channel);
            return true;
        }
        return false;
    }

    async unadminChatterFromChannel(admin: Chatter, oldadmin: Chatter, channelId: number): Promise<boolean> {
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { channelAdmins: true, owner: true });
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
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { channelAdmins: true, mutedUsers: true })
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.muteChatterFromChannel(user, channel);
    }

    async unmuteChatterFromChannel(admin: Chatter, user: Chatter, channelId: number) {
        const channel: ChatChannel = await this.getChannelById(
            channelId,
            { channelAdmins: true, mutedUsers: true })
        if (this.channelService.isChatterAdminFromChannel(admin, channel))
            this.channelService.unmuteChatterFromChannel(user, channel);
    }

    isInvited(chatter: Chatter, channel: ChatChannel): boolean {
        return chatter.invitations.findIndex((chan) => chan.id == channel.id) != -1;
    }

    async inviteUserToChannel(inviter: Chatter, invited: Chatter, channelId: number): Promise<ChatChannel> {
        if (this.chatterService.isBlocked(invited, inviter))
            return null
        const channel: ChatChannel = await this.getChannelById(channelId, { channelAdmins: true, channelUsers: true })
        if (channel.channelStatus == ChannelStatus.Private
            && this.channelService.isChatterAdminFromChannel(inviter, channel)
            && !this.isChannelUser(invited, channel)
            && !this.isInvited(invited, channel)) {
            await this.chatterService.addInvitation(invited, channel);
            return channel;
        }
        return null;
    }

    async inviteUserToPrivateChannel(invited: Chatter, channelId: number): Promise<ChatChannel> {
        const channel: ChatChannel = await this.getChannelById(channelId, { channelAdmins: true, channelUsers: true })
        await this.chatterService.addInvitation(invited, channel);
        return channel;
    }

    async acceptInvitation(invited: Chatter, channelId: number): Promise<ChatChannel> {
        const channel: ChatChannel = await this.getChannelById(channelId, { channelUsers: true })
        if (channel && this.isInvited(invited, channel)) {
            this.chatterService.popInvitation(invited, channel);
            await this.addChannelUser(invited, "", channelId);
            return channel;
        }
        return null;
    }

    async refuseInvitation(invited: Chatter, channelId: number): Promise<ChatChannel> {
        const channel: ChatChannel = await this.getChannelById(channelId, { channelUsers: true })
        if (channel && this.isInvited(invited, channel)) {
            await this.chatterService.popInvitation(invited, channel);
            return channel;
        }
        return null;
    }

    async askPrivate(inviter: Chatter, invited: Chatter): Promise<boolean> {
        return this.chatterService.askPrivate(inviter, invited)
    }

    async blockUser(user: Chatter, blocked: Chatter): Promise<boolean> {
        return this.chatterService.blockChatter(user, blocked)
    }

    async unblockUser(user: Chatter, blocked: Chatter): Promise<boolean> {
        return this.chatterService.unblockChatter(user, blocked)
    }
}
