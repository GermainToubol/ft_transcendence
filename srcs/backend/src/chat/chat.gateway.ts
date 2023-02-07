import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuardWs } from 'src/auth/guards/jwt-auth.guard';
import { Chatter } from 'src/chatter/chatter.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import { ChannelStatus, ChatChannel } from './channel/channel.entity';
import { ChatService } from './chat.service';
import { AdminExport } from './exports/admin.export';
import { ChannelExport } from './exports/channel.export';
import { SendMessage } from './message/message.entity';
import { MessageExceptionFilter } from './message/message.filter';
import { BanChatterDto } from './types/banchatter.dto';
import { ChatChannelDto } from './types/channel.dto';
import { InvitationDto } from './types/invitation.dto';
import { LeaveDto } from './types/leave.dto';
import { ChatMessageDto } from './types/message.dto';
import { PasswordDto } from './types/password.dto';
import { UserSocket } from './usersocket.adapter';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseGuards(JwtAuthGuardWs)
@WebSocketGateway({ cors: { origin: "*" }, path: '/chatsocket' })
export class ChatGateway {
    @WebSocketServer()
    server: Server;
    socketMap: Map<string, UserSocket>;


    constructor(
        private chatService: ChatService,
        private usersService: UsersService,
    ) {
        this.socketMap = new Map<string, UserSocket>()
    }


    async handleConnection(client: UserSocket) {
        console.log(`connection: ${client.id}`);
        this.socketMap.set(client.userLogin, client);
        const channels: ChatChannel[] = await this.chatService
            .getChannels({ relations: { bannedUsers: true } })
            .catch(() => { console.log("Invalid channel search"); return null; })
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.channels"])
            .then((user) => { return user.chatter })
            .catch(() => { console.log("Invalid user search"); return null; })

        if (!channels || !chatter)
            return;
        channels.filter((chan) => !this.chatService.isBannedFromChannel(chatter, chan))
            .filter((chan) => chan.channelStatus === ChannelStatus.Public
                || (chatter.channels.findIndex((elm) => elm.id === chan.id) !== -1))
            .forEach((chan) => client.join(`channel${chan.id}`))
    }


    handleDisconnect(client: UserSocket) {
        console.log(`disconnection: ${client.id}`);
        this.socketMap.delete(client.userLogin);
    }


    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: UserSocket, payload: ChatMessageDto) {
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.channel, { mutedUsers: true, bannedUsers: true, channelUsers: true });
        const user: User = await this.usersService
            .findOne(client.userLogin, { chatter: true })

        if (!channel || !user)
            return;
        if (this.chatService.isMutedFromChannel(user.chatter, channel)
            || this.chatService.isBannedFromChannel(user.chatter, channel)
            || !this.chatService.isChannelUser(user.chatter, channel))
            return;

        let message: SendMessage = await this.chatService
            .newMessage(
                payload.content,
                channel,
                user.chatter
            );
        if (!message)
            return;
        message.channel = channel
        message.authorLogin = user.login;
        message.authorUsername = user.usual_full_name;
        this.server.to(`channel${channel.id}`).emit('recvMessage', message)
    }

    addUsersToChannel(room: string, userlist: string[]) {
        if (userlist.length === 0) {
            console.log("aa")
            this.socketMap.forEach((value) => {
                value.join(room);
            })
            return;
        }
        userlist.forEach((userid: string) => {
            this.socketMap.get(userid).join(room);
        })
    }

    @SubscribeMessage("joinChannel")
    async handleJoinChannel(client: UserSocket, payload: PasswordDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        if (await this.chatService.addChannelUser(chatter, payload.password, payload.channelId)) {
            client.join(`channel${payload.channelId}`)
            client.emit("retriveMessages", payload.channelId)
        }
    }

    @SubscribeMessage("leaveChannel")
    async handleLeaveChannel(client: UserSocket, payload: LeaveDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, {chatter: true})
            .then((user => user.chatter))
            .catch(() => null)
        if (await this.chatService.leaveChannel(chatter, payload.channelId))
            client.leave(`channel${payload.channelId}`)
    }

    @SubscribeMessage("setPassword")
    async handleSetPassword(client: UserSocket, payload: PasswordDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        await this.chatService.addChannelPassword(chatter, payload.password, payload.channelId)
    }

    @UseFilters(new MessageExceptionFilter("Invalid channel creation"))
    @SubscribeMessage("addChannel")
    async handleChannelCreation(client: UserSocket, payload: ChatChannelDto) {
        const owner: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const channel = await this.chatService
            .createChannel(
                payload.channelName,
                payload.channelLevel,
                payload.password,
                owner
            );
        if (!channel || !owner)
            return;
        console.log("tatata", channel)
        client.join(`channel${channel.id}`);
        const chanMsg: ChannelExport = {
            id: channel.id,
            channelName: channel.channelName,
            channelAdm: false,
            channelStatus: channel.channelStatus,
            hasPasswd: false
        }
        if (payload.channelLevel == ChannelStatus.Private)
            this.server
                .to(`channel${channel.id}`)
                .emit('updateChannel', chanMsg);
        else
            this.server
                .emit('updateChannel', chanMsg);
        if (payload.channelLevel == ChannelStatus.Public)
            this.addUsersToChannel(`channel${channel.id}`, [])
        this.addUsersToChannel(`channel${channel.id}`, [client.userLogin])
        await this.chatService.addChannelUser(owner, payload.password, channel.id);
        const adm: AdminExport = {
            channelId: channel.id,
            adminStatus: true,
        };
        client.emit("updateAdmin", adm)
    }


    @SubscribeMessage("adminChatter")
    async handleChatterAdmin(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch((err) => { console.log(err); return null; })
        const newadmin: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch((err) => { console.log(err); return null; })
        const adm: AdminExport = {
            channelId: payload.channelId,
            adminStatus: true,
        };
        await this.chatService
            .adminChatterFromChannel(
                admin,
                newadmin,
                payload.channelId)
            .then((res) => {
                if (res)
                    this.socketMap
                        .get(payload.banLogin)
                        .emit('updateAdmin', adm);
            })
            .catch((err) => console.log(err))
    }


    @SubscribeMessage("unadminChatter")
    async handleChatterUnadmin(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const oldadmin: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        const adm: AdminExport = {
            channelId: payload.channelId,
            adminStatus: false,
        };
        await this.chatService
            .unadminChatterFromChannel(
                admin,
                oldadmin,
                payload.channelId)
            .then((res) => {
                if (res)
                    this.socketMap
                        .get(payload.banLogin)
                        .emit('updateAdmin', adm);
            })
            .catch(() => null)
    }

    @SubscribeMessage("banChatter")
    async handleChatterBan(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!admin || !banned)
            return;
        await this.chatService
            .banChatterFromChannel(admin, banned, payload.channelId)
            .then((ret) => {
                if (ret)
                    this.socketMap
                        .get(payload.banLogin)
                        .leave(`channel${payload.channelId}`);
            })
            .catch(() => null)
    }

    @SubscribeMessage("unbanChatter")
    async handleChatterUnban(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!admin || !banned)
            return;
        if (await this.chatService.unbanChatterFromChannel(admin, banned, payload.channelId).catch(() => false))
            this.socketMap.get(payload.banLogin).join(`channel${payload.channelId}`)
    }

    @SubscribeMessage("muteChatter")
    async handleChatterMute(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const muted: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!admin || !muted)
            return;
        await this.chatService
            .muteChatterFromChannel(admin, muted, payload.channelId)
            .catch(() => null)
    }

    @SubscribeMessage("unmuteChatter")
    async handleChatterUnmute(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const mute: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!admin || !mute)
            return;
        await this.chatService
            .unmuteChatterFromChannel(admin, mute, payload.channelId)
            .catch(() => null)
    }

    @SubscribeMessage("inviteUser")
    async handleInviteChatter(client: UserSocket, payload: InvitationDto) {
        const inviter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const invited: Chatter = await this.usersService
            .findOne(payload.userLogin, ["chatter", "chatter.invitations"])
            .then((user) => user.chatter)
            .catch(() => null)
        if (!inviter || !invited)
            return;
        const channel: ChatChannel = await this.chatService
            .inviteUserToChannel(inviter, invited, payload.channelId)
        if (channel && this.socketMap.get(payload.userLogin)) {
            const invitation: ChannelExport = {
                id: channel.id,
                channelName: channel.channelName,
                channelStatus: channel.channelStatus,
                channelAdm: false,
                hasPasswd: false,
            }
            this.socketMap.get(payload.userLogin).emit("addInvitation", invitation)
        }
    }

    @SubscribeMessage("acceptInvitation")
    async handleAcceptInvite(client: UserSocket, payload: InvitationDto) {
        const invited: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.invitations"])
            .then((user) => user.chatter)
            .catch(() => null)
        if (!invited)
            return;
        const channel: ChatChannel = await this.chatService.acceptInvitation(invited, payload.channelId);
        if (!channel)
            return;
        const message: ChannelExport = { id: channel.id, channelName: channel.channelName, channelAdm: false, channelStatus: ChannelStatus.Private, hasPasswd: false }
        client.join(`channel${payload.channelId}`);
        client.emit("updateChannel", message);
        client.emit("popInvitation", message);
        client.emit("retriveMessage", payload.channelId);
    }

    @SubscribeMessage("refuseInvitation")
    async handleRefuseMessage(client: UserSocket, payload: InvitationDto) {
        const invited: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.invitations"])
            .then((user) => user.chatter)
            .catch(() => null)
        if (!invited)
            return;
        const channel: ChatChannel = await this.chatService.refuseInvitation(invited, payload.channelId);
        if (!channel)
            return;
        const message: ChannelExport = { id: channel.id, channelName: channel.channelName, channelAdm: false, channelStatus: ChannelStatus.Private, hasPasswd: false }
        client.emit("popInvitation", message);
    }
}
