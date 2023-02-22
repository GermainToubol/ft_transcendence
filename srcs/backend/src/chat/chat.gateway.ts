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
import { UserExport } from './exports/user.export';
import { SendMessage } from './message/message.entity';
import { MessageExceptionFilter } from './message/message.filter';
import { AcceptDto } from './types/accept.dto';
import { BanChatterDto } from './types/banchatter.dto';
import { ChatChannelDto } from './types/channel.dto';
import { InvitationDto } from './types/invitation.dto';
import { LeaveDto } from './types/leave.dto';
import { ChatMessageDto } from './types/message.dto';
import { PasswordDto } from './types/password.dto';
import { PrivateDto } from './types/private.dto';
import { UserSocket } from './usersocket.adapter';

@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
@UseGuards(JwtAuthGuardWs)
@WebSocketGateway({ path: '/api/chatsocket' })
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
        this.socketMap.set(client.userLogin, client);
        const channels: ChatChannel[] = await this.chatService
            .getChannels({ relations: { bannedUsers: true, channelUsers: true } })
            .catch(() => null)
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.channels"])
            .then((user) => { return user.chatter })
            .catch(() => null)

        if (!channels || !chatter)
            return
        channels.filter((channel: ChatChannel) => {
            return this.chatService.isChannelUser(chatter, channel)
        })
            .filter((channel: ChatChannel) => {
                return !this.chatService.isBannedFromChannel(chatter, channel)
            })
            .forEach((channel: ChatChannel) => {
                client.join(`channel${channel.id}`)
            })
    }


    handleDisconnect(client: UserSocket) {
		this.server.emit('discoForGame', {login: client.userLogin})
        this.socketMap.delete(client.userLogin);
    }


    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: UserSocket, payload: ChatMessageDto) {
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.channel, {
                mutedUsers: true,
                bannedUsers: true,
                channelUsers: true
            })
            .catch(() => null)
        const user: User = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.blocks"])
            .catch(() => null)

        if (!channel || !user)
            return
        if (!this.chatService.isChannelUser(user.chatter, channel)
            || this.chatService.isBannedFromChannel(user.chatter, channel)
            || this.chatService.isMutedFromChannel(user.chatter, channel))
            return

        let message: SendMessage = await this.chatService
            .newMessage(
                payload.content,
                channel,
                user.chatter
            )
            .catch(() => null)
        if (!message)
            return
        message.channel = channel
        message.authorLogin = user.login;
        message.authorUsername = user.usual_full_name;
        this.server.to(`channel${channel.id}`).emit('recvMessage', message)
    }

    @SubscribeMessage("sendGameInvitation")
    async handleGameRequest(client: UserSocket, payload: ChatMessageDto) {
		const mode = payload.content
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.channel, {
                mutedUsers: true,
                bannedUsers: true,
                channelUsers: true
            })
            .catch(() => null)
        const user: User = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.blocks"])
            .catch(() => null)

        if (!channel || !user)
            return
        if (!this.chatService.isChannelUser(user.chatter, channel)
            || this.chatService.isBannedFromChannel(user.chatter, channel)
            || this.chatService.isMutedFromChannel(user.chatter, channel))
            return
		console.log(this.server.sockets.adapter.rooms.get(`channel${channel.id}`).size)
		if (this.server.sockets.adapter.rooms.get(`channel${channel.id}`).size == 2) {
			this.server.to(`channel${channel.id}`).emit('receiveInvitation', {login: user.login, mode: mode, id: channel.id})
		} else {
			this.server.to(`channel${channel.id}`).emit('cannotInvite', {login: user.login, mode: mode, id: channel.id})
		}
    }

	@SubscribeMessage("acceptGameInvitation")
    async handleGameAcceptation(client: UserSocket, payload: AcceptDto) {
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.chan, {
                mutedUsers: true,
                bannedUsers: true,
                channelUsers: true
            })
            .catch(() => null)
        const user: User = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.blocks"])
            .catch(() => null)

        if (!channel || !user)
            return
        if (!this.chatService.isChannelUser(user.chatter, channel)
            || this.chatService.isBannedFromChannel(user.chatter, channel)
            || this.chatService.isMutedFromChannel(user.chatter, channel))
            return
		console.log(payload.mode)
		if (payload.mode === 'true') {
			this.server.to(`channel${payload.id}`).emit('acceptInvitation', {accept: payload.accept, mode: 'hard'})
		}
		else {
			this.server.to(`channel${payload.id}`).emit('acceptInvitation', {accept: payload.accept, mode: 'normal'})
		}
    }

    addUsersToChannel(room: string, userlist: string[]) {
        if (userlist.length === 0) {
            this.socketMap.forEach((userSocker: UserSocket) => {
                userSocker.join(room)
            })
            return
        }
        userlist.forEach((userid: string) => {
            const userSocket: UserSocket = this.socketMap.get(userid)
            if (userSocket !== undefined)
                userSocket.join(room)
        })
    }

    @SubscribeMessage("joinChannel")
    async handleJoinChannel(client: UserSocket, payload: PasswordDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!chatter)
            return
        if (await this.chatService.addChannelUser(chatter, payload.password, payload.channelId).catch(() => false)) {
            client.join(`channel${payload.channelId}`)
            client.emit("retriveMessages", payload.channelId)
        }
    }

    @SubscribeMessage("leaveChannel")
    async handleLeaveChannel(client: UserSocket, payload: LeaveDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user => user.chatter))
            .catch(() => null)
        if (!chatter)
            return
        if (await this.chatService.leaveChannel(chatter, payload.channelId).catch(() => false)) {
            client.leave(`channel${payload.channelId}`)
            client.emit('leavedDone', payload)
        }
    }

    @SubscribeMessage("setPassword")
    async handleSetPassword(client: UserSocket, payload: PasswordDto) {
        const chatter: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        if (!chatter)
            return
        await this.chatService.addChannelPassword(
            chatter,
            payload.password,
            payload.channelId
        )
    }

    @UseFilters(new MessageExceptionFilter("Invalid channel creation"))
    @SubscribeMessage("addChannel")
    async handleChannelCreation(client: UserSocket, payload: ChatChannelDto) {
        if (payload.channelLevel === ChannelStatus.Locked) {
            return
        }
        const owner: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => { return user.chatter })
            .catch(() => null)
        if (!owner)
            return
        const channel: ChatChannel = await this.chatService
            .createChannel(
                payload.channelName,
                payload.channelLevel,
                payload.password,
                owner
            )
            .catch(() => null)
        if (!channel)
            return;
        client.join(`channel${channel.id}`);
        const chanMsg: ChannelExport = {
            id: channel.id,
            channelName: channel.channelName,
            channelAdm: false,
            channelStatus: channel.channelStatus,
            hasPasswd: false,
            channelUser: false
        }
        if (payload.channelLevel === ChannelStatus.Private) {
            this.server
                .to(`channel${channel.id}`)
                .emit('updateChannel', chanMsg);
        }
        else {
            this.server
                .emit('updateChannel', chanMsg);
        }
        if (payload.channelLevel === ChannelStatus.Public)
            this.addUsersToChannel(`channel${channel.id}`, [])
        this.addUsersToChannel(`channel${channel.id}`, [client.userLogin])
        if (await this.chatService.addChannelUser(owner, payload.password, channel.id, true).catch(() => false)) {
            const adm: AdminExport = {
                channelId: channel.id,
                adminStatus: true,
            };
            client.emit("updateAdmin", adm)
        }
    }


    @SubscribeMessage("adminChatter")
    async handleChatterAdmin(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const newadmin: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
            .catch(() => null)
        const adm: AdminExport = {
            channelId: payload.channelId,
            adminStatus: true,
        };
        if (!admin || !newadmin)
            return
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
            .findOne(payload.userLogin, ["chatter", "chatter.invitations", "chatter.blocks"])
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
                channelUser: false
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
        const message: ChannelExport = {
            id: channel.id,
            channelName: channel.channelName,
            channelAdm: false,
            channelStatus: ChannelStatus.Private,
            hasPasswd: false,
            channelUser: true
        }
        client.join(`channel${payload.channelId}`);
        client.emit("updateChannel", message);
        client.emit("popInvitation", message);
        client.emit("retriveMessages", payload.channelId);
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
        const message: ChannelExport = {
            id: channel.id,
            channelName: channel.channelName,
            channelAdm: false,
            channelStatus: ChannelStatus.Private,
            hasPasswd: false,
            channelUser: false
        }
        client.emit("popInvitation", message);
    }

    @SubscribeMessage("blockChatter")
    async handleBlockChatter(client: UserSocket, payload: BanChatterDto) {
        const user: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.blocks"])
            .then((user) => user.chatter)
            .catch(() => null)
        const blocked: Chatter = await this.usersService
            .findOne(payload.banLogin, ["chatter", "chatter.user"])
            .then((user) => user.chatter)
            .catch(() => null)

        if (!user || !blocked)
            return
        if (await this.chatService.blockUser(user, blocked)) {
            const message: UserExport = {
                login: blocked.user.login,
                name: blocked.user.usual_full_name
            }
            client.emit('addBlock', message)
        }
    }

    @SubscribeMessage("unblockChatter")
    async handleUnlockChatter(client: UserSocket, payload: BanChatterDto) {
        const user: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.blocks"])
            .then((user) => user.chatter)
            .catch(() => null)
        const blocked: Chatter = await this.usersService
            .findOne(payload.banLogin, ["chatter", "chatter.user"])
            .then((user) => user.chatter)
            .catch(() => null)

        if (!user || !blocked)
            return
        if (await this.chatService.unblockUser(user, blocked).catch(() => false)) {
            const message: UserExport = {
                login: blocked.user.login,
                name: blocked.user.usual_full_name
            }
            client.emit('popBlock', message)
        }
    }

    @SubscribeMessage("askPrivate")
    async handleAskPrivate(client: UserSocket, payload: PrivateDto) {
        const inviter: Chatter = await this.usersService
            .findOne(client.userLogin, ["chatter", "chatter.privates", "chatter.blocks"])
            .then((user) => user.chatter)
            .catch(() => null)
        const invited: Chatter = await this.usersService
            .findOne(payload.userLogin, ["chatter", "chatter.privates", "chatter.blocks"])
            .then((user) => user.chatter)
            .catch(() => null)
        if (!inviter
            || !invited
            || !await this.chatService.askPrivate(inviter, invited).catch(() => false))
            return;
        const channel = await this.chatService.createChannel(
            `Priv ${client.userLogin}/${payload.userLogin}`,
            ChannelStatus.Locked,
            "",
            inviter
        )
        await this.chatService.addChannelUser(inviter, "", channel.id, true)
        await this.chatService.addChannelUser(invited, "", channel.id, true)
        const chanMsg: ChannelExport = {
            id: channel.id,
            channelName: channel.channelName,
            channelAdm: false,
            channelStatus: channel.channelStatus,
            hasPasswd: false,
            channelUser: true
        }
        client.join(`channel${channel.id}`)
        client.emit('updateChannel', chanMsg)
        if (this.socketMap.get(payload.userLogin)) {
            this.socketMap.get(payload.userLogin).emit('updateChannel', chanMsg)
            this.socketMap.get(payload.userLogin).join(`channel${channel.id}`)
        }
    }
}
