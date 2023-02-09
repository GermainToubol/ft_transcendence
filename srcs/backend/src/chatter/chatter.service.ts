import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatChannel } from 'src/chat/channel/channel.entity';
import { Repository } from 'typeorm';
import { Chatter } from './chatter.entity';

@Injectable()
export class ChatterService {
  constructor(
    @InjectRepository(Chatter)
    private chatterRepository: Repository<Chatter>
  ) { }

  async create(): Promise<Chatter> {
    const chatter: Chatter = this.chatterRepository.create();
    return this.chatterRepository.save(chatter);
  }

  async addInvitation(invited: Chatter, channel: ChatChannel) {
    invited.invitations.push(channel);
    await this.chatterRepository.save(invited);
  }

  async popInvitation(invited: Chatter, channel: ChatChannel) {
    const index = invited.invitations.findIndex((chan) => chan.id == channel.id)
    if (index == -1)
      return;
    invited.invitations.splice(index, 1);
    await this.chatterRepository.save(invited)
  }

  async blockChatter(user: Chatter, blocked: Chatter): Promise<boolean> {
    const index = user.blocks.findIndex((chatter) => chatter.id == blocked.id);
    if (index != -1 || user.id === blocked.id)
      return false
    user.blocks.push(blocked);
    await this.chatterRepository.save(user);
    return true
  }

  async unblockChatter(user: Chatter, blocked: Chatter): Promise<boolean> {
    const index = user.blocks.findIndex((chatter) => chatter.id == blocked.id);
    if (index == -1)
      return false;
    user.blocks.splice(index, 1);
    await this.chatterRepository.save(user);
    return true
  }

  isBlocked(user: Chatter, blocked: Chatter) {
    if (user.blocks.findIndex((chatter) => chatter.id === blocked.id) != -1)
      return true;
    return false;
  }

  async askPrivate(inviter: Chatter, invited: Chatter): Promise<boolean> {
    if (inviter.id === invited.id || this.isBlocked(inviter, invited) || this.isBlocked(invited, inviter))
      return false
    if (inviter.privates.findIndex((usr) => usr.id === invited.id) !== -1
      || invited.privates.findIndex((usr) => usr.id === inviter.id) !== -1)
      return false
    inviter.privates.push(invited)
    await this.chatterRepository.save(inviter)
    return true
  }
}
