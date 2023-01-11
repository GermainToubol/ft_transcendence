import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatter } from './chatter.entity';
import { ChatterService } from './chatter.service';

@Module({
    imports: [TypeOrmModule.forFeature([Chatter])],
    providers: [ChatterService],
})

export class ChatterModule { }
