import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chatter } from 'src/chatter/chatter.entity';
import { Repository } from 'typeorm';
import { ChatChannel } from '../channel/channel.entity';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>
  ) { }

  async create(
    content: string,
    channel: ChatChannel,
    author: Chatter,
  ): Promise<Message> {
    const msg: Message = this.messageRepository.create()
    msg.content = content;
    msg.channel = channel;
    msg.author = author;
    return this.messageRepository.save(msg);
  }

  async findAllMessages(): Promise<Message[]> {
    return this.messageRepository.find({
      relations: {
        channel: true,
        author: true,
      },
    });
  }

  async findMessageChannel(channel: ChatChannel): Promise<Message[]> {
    return this.messageRepository.find({
      where: {
        channel: channel,
      },
      relations: ["author", "author.user"]
    })
  }
}
