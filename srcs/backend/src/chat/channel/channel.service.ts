import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Message)
        private messageRepository: Repository<Message>
    ) { }

    async create(content: string): Promise<Message> {
        const msg = this.messageRepository.create()
        msg.content = content;
        return await this.messageRepository.save(msg);
    }

    async findAllMessages(): Promise<Message[]> {
        return await this.messageRepository.find();
    }
}
