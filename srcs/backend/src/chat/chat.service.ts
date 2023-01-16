import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelEntity } from '../channel/channel.entity';
import { Chatter } from '../chatter/chatter.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) { }

    async create(user: Chatter, channel: ChannelEntity, content: string) {
        const message: Message = this.messageRepository.create();
        message.author = user;
        message.channel = channel;
        message.content = content;
        await this.messageRepository.save(message);
    }
}
