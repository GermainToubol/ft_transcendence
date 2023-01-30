import { Controller, Get, Res, Param, UseGuards } from '@nestjs/common';
import { Response } from "express";
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReqUser } from 'src/users/req-user.decorator';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/user.service';
import { ChatChannel } from './channel/channel.entity';
import { ChatService } from './chat.service';
import { Message, SendMessage } from './message/message.entity';
import { ChannelExport } from './exports/channel.export';

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService, private userService: UsersService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findChannels(@Res() res: Response, @ReqUser() user: User) {
        console.log(user)
        const chatter = await this.userService.findOne(user.login, { chatter: true }).then((u) => u.chatter);
        const channels = await this.chatService.getChannels({ relations: { channelAdmins: true } });
        const filtered = channels.map(function(chan: ChatChannel): ChannelExport {
            return {
                id: chan.id,
                channelName: chan.channelName,
                channelAdm: chan.channelAdmins.findIndex((c) => c.id === chatter.id) !== -1,
            };
        })
        res.json(filtered);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findChannelMessages(
        @Res() res: Response,
        @Param('id') chanId: number) {
        const channel = await this.chatService.getChannelById(chanId);
        const messages: Message[] = await this.chatService.getMessages(channel);
        const sendMessages: SendMessage[] = messages.map(
            function(msg: Message): SendMessage {
                return {
                    id: msg.id,
                    content: msg.content,
                    channel: msg.channel,
                    authorLogin: msg.author.user.login,
                    authorUsername: msg.author.user.usual_full_name,
                };
            })
        res.json(sendMessages)
    }
}
