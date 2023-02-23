import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatter } from './chatter.entity';
import { ChatterService } from './chatter.service';

@Module({
    providers: [
        ChatterService,
    ],
    imports: [
        TypeOrmModule.forFeature([
            Chatter,
        ]),
    ],
    exports: [
        ChatterService,
    ]
})
export class ChatterModule { }
