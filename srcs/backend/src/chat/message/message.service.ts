import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatChannel } from '../channel/channel.entity';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    ) { }

    async create(content: string, channel: ChatChannel): Promise<Message> {
        const msg = this.messageRepository.create()
        msg.content = content;
        msg.channel = channel;
        return await this.messageRepository.save(msg);
    }

    async findAllMessages(): Promise<Message[]> {
        return await this.messageRepository.find({ relations: { channel: true } });
    }

    async findMessageChannel(channel: ChatChannel): Promise<Message[]> {
        return await this.messageRepository.find({ where: { channel: channel } })
    }
}
