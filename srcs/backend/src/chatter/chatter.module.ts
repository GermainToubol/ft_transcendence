import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatter } from './chatter.entity';
import { ChatterService } from './chatter.service';
import { ChatterController } from './chatter.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Chatter])],
    providers: [ChatterService],
    controllers: [ChatterController],
})

export class ChatterModule { }
