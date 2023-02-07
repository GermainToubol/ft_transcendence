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
        return await this.chatterRepository.save(chatter);
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

    async blockChatter(user: Chatter, blocked: Chatter){
        const index = user.blocks.findIndex((chatter) => chatter.id == blocked.id);
        if (index != -1)
            return ;
        user.blocks.push(blocked);
        await this.chatterRepository.save(user);
    }

    async unblockChatter(user: Chatter, blocked: Chatter) {
        const index = user.blocks.findIndex((chatter) => chatter.id == blocked.id);
        if (index == -1)
            return ;
        user.blocks.splice(index, 1);
        await this.chatterRepository.save(user);
    }

    isBlocked(user: Chatter, blocked: Chatter) {
        if (user.blocks.findIndex((chatter) => chatter.id == blocked.id) != -1)
            return true;
        return false;
    }
}
