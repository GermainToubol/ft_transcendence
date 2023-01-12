import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatter } from './chatter.entity';

@Injectable()
export class ChatterService {
    constructor(@InjectRepository(Chatter) private chatterRepository: Repository<Chatter>) { }

    async create(): Promise<Chatter> {
        let newChatter: Chatter = this.chatterRepository.create();

        await this.chatterRepository.save(newChatter);
        return newChatter;
    }

    async getChatterById(id: number): Promise<Chatter> {
        let currentChatter = await this.chatterRepository.findOne({
            where: { id: id },
            relations: { blocks: true }
        });
        return currentChatter;
    }

    async blockChatter(chatter: Chatter, toBlock: Chatter) {
        if (chatter.id === toBlock.id
            || chatter.blocks.findIndex((user) => user.id === toBlock.id) > -1)
            return;
        chatter.blocks.push(toBlock);
        await this.chatterRepository.manager.save(chatter)
    }

    async unblockChatter(chatter: Chatter, toBlock: Chatter) {
        if (chatter.id === toBlock.id
            || chatter.blocks.findIndex((user) => user.id === toBlock.id) === -1)
            return;
        chatter.blocks = chatter.blocks.filter((chatter) => chatter.id != toBlock.id);
        await this.chatterRepository.manager.save(chatter)
    }
}
