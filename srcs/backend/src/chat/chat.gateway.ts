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
    socketMap: Map<string, string>;


    constructor(
        private chatService: ChatService,
        private usersService: UsersService,
    ) {
        this.socketMap = new Map<string, string>()
    }


    handleConnection(client: UserSocket) {
        console.log(`connection: ${client.id}`);
        this.socketMap.set(client.userLogin, client.id);
    }


    handleDisconnect(client: UserSocket) {
        console.log(`disconnection: ${client.id}`);
        this.socketMap.delete(client.userLogin);
    }


    @UseFilters(new MessageExceptionFilter("Invalid message"))
    @SubscribeMessage("sendMessage")
    async handleMessage(client: UserSocket, payload: ChatMessageDto) {
        const channel: ChatChannel = await this.chatService
            .getChannelById(payload.channel);
        const user: User = await this.usersService
            .findOne(client.userLogin, { chatter: true })

        if (!channel || !user)
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
        if (channel.channelStatus == ChannelStatus.Public)
            this.server.emit('recvMessage', message);
        else
            this.server.to(`channel${channel.id}`).emit('recvMessage', message)
    }


    @UseFilters(new MessageExceptionFilter("Invalid channel creation"))
    @SubscribeMessage("addChannel")
    async handleChannelCreation(client: UserSocket, payload: ChatChannelDto) {
        const channel = await this.chatService.createChannel(
            payload.channelName,
            payload.channelLevel,
        );
        if (!channel)
            return;
        client.join(`channel${channel.id}`);
        if (payload.channelLevel == ChannelStatus.Private)
            this.server.to(`channel${channel.id}`).emit('updateChannel', channel);
        else
            this.server.emit('updateChannel', channel);
    }

    @SubscribeMessage("adminChatter")
    async handleChatterAdmin(client: UserSocket, payload: BanChatterDto) {

        console.log(payload)
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(admin)
        console.log("admin")

        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(banned)
        console.log("banned")
        await this.chatService.adminChatterFromChannel(admin, banned, payload.channelId);
    }

    @SubscribeMessage("unadminChatter")
    async handleChatterUnadmin(client: UserSocket, payload: BanChatterDto) {

        console.log(payload)
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(admin)
        console.log("admin")
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(banned)
        console.log("unbanned")
        await this.chatService.unadminChatterFromChannel(admin, banned, payload.channelId);
    }

    @SubscribeMessage("banChatter")
    async handleChatterBan(client: UserSocket, payload: BanChatterDto) {

        console.log(payload)
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(admin)
        console.log("admin")

        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(banned)
        console.log("banned")
        await this.chatService.banChatterFromChannel(admin, banned, payload.channelId);
    }

    @SubscribeMessage("unbanChatter")
    async handleChatterUnban(client: UserSocket, payload: BanChatterDto) {

        console.log(payload)
        const admin: Chatter = await this.usersService
            .findOne(client.userLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(admin)
        console.log("admin")
        const banned: Chatter = await this.usersService
            .findOne(payload.banLogin, { chatter: true })
            .then((user) => user.chatter)
        console.log(banned)
        console.log("unbanned")
        await this.chatService.unbanChatterFromChannel(admin, banned, payload.channelId);
    }
}
