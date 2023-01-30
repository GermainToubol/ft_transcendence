import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtAuthGuardWs } from 'src/auth/guards/jwt-auth.guard';
import { Chatter } from 'src/chatter/chatter.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import { ChannelStatus, ChatChannel } from './channel/channel.entity';
import { ChatService } from './chat.service';
import { SendMessage } from './message/message.entity';
import { MessageExceptionFilter } from './message/message.filter';
import { BanChatterDto } from './types/banchatter.dto';
import { ChatChannelDto } from './types/channel.dto';
import { ChatMessageDto } from './types/message.dto';
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
        const channels = await this.chatService.getChannels({ relations: { bannedUsers: true } });
        console.log(channels)
        const chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => { return user.chatter })
        channels.forEach((chan) => {
            if (!this.chatService.isBannedFromChannel(chatter, chan))
                client.join(`channel${chan.id}`);
        })
    }


    handleDisconnect(client: UserSocket) {
        console.log(`disconnection: ${client.id}`);
        this.socketMap.delete(client.userLogin);
    }


    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: UserSocket, payload: ChatMessageDto) {
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.channel, { mutedUsers: true });
        const user: User = await this.usersService
            .findOne(client.userLogin, { chatter: true })

        if (!channel || !user)
            return;

        if (this.chatService.isMutedFromChannel(user.chatter, channel))
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

    @UseFilters(new MessageExceptionFilter("Invalid channel creation"))
    @SubscribeMessage("addChannel")
    async handleChannelCreation(client: UserSocket, payload: ChatChannelDto) {
        const owner = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const channel = await this.chatService.createChannel(
            payload.channelName,
            payload.channelLevel,
            owner
        );
        if (!channel || !owner)
            return;
        client.join(`channel${channel.id}`);
        if (payload.channelLevel == ChannelStatus.Private)
            this.server.to(`channel${channel.id}`).emit('updateChannel', channel);
        else
            this.server.emit('updateChannel', channel);
        if (payload.channelLevel == ChannelStatus.Public)
            this.addUsersToChannel(`channel${channel.id}`, [])
    }

    @SubscribeMessage("adminChatter")
    async handleChatterAdmin(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const newadmin: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        await this.chatService.adminChatterFromChannel(admin, newadmin, payload.channelId);
    }

    @SubscribeMessage("unadminChatter")
    async handleChatterUnadmin(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const oldadmin: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        await this.chatService.unadminChatterFromChannel(admin, oldadmin, payload.channelId);
    }

    @SubscribeMessage("banChatter")
    async handleChatterBan(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        if (await this.chatService.banChatterFromChannel(admin, banned, payload.channelId))
            this.socketMap.get(payload.banLogin).leave(`channel${payload.channelId}`);
    }

    @SubscribeMessage("unbanChatter")
    async handleChatterUnban(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        if (await this.chatService.unbanChatterFromChannel(admin, banned, payload.channelId))
            this.socketMap.get(payload.banLogin).join(`channel${payload.channelId}`)
    }

    async sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    @SubscribeMessage("muteChatter")
    async handleChatterMute(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const muted: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        await this.chatService.muteChatterFromChannel(admin, muted, payload.channelId)
    }

    @SubscribeMessage("unmuteChatter")
    async handleChatterUnmute(client: UserSocket, payload: BanChatterDto) {
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        const mute: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        await this.chatService.unmuteChatterFromChannel(admin, mute, payload.channelId)
    }
}
