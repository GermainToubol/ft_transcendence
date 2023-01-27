import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chatter } from './chatter.entity';

@Injectable()
export class ChatterService {
    constructor(
        @InjectRepository(Chatter)
        private chatterRepository: Repository<Chatter>
    ) { }

    async create(): Promise<Chatter> {
        const chatter = this.chatterRepository.create();
        return await this.chatterRepository.save(chatter);
    }
}
