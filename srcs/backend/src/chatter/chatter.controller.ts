import { Controller, Get, Param } from '@nestjs/common';
import { Chatter } from './chatter.entity';
import { ChatterService } from './chatter.service';

@Controller('chatter')
export class ChatterController {
    constructor(private chatterService: ChatterService) { }

    @Get()
    async addNewChatter(): Promise<string> {
        await this.chatterService.create();
        return "new chatter created";
    }

    @Get('block/:me/:other')
    async blockChatter(
        @Param('me') me: number,
        @Param('other') other: number): Promise<string> {

        let user: Chatter = await this.chatterService.getChatterById(me);
        let blocked: Chatter = await this.chatterService.getChatterById(other);

        if (!user || !blocked)
            return "Invalid user";
        await this.chatterService.blockChatter(user, blocked);
        return `${me} blocked ${other}`;
    }

    @Get('unblock/:me/:other')
    async unblockChatter(
        @Param('me') me: number,
        @Param('other') other: number): Promise<string> {

        let user: Chatter = await this.chatterService.getChatterById(me);
        let blocked: Chatter = await this.chatterService.getChatterById(other);

        if (!user || !blocked)
            return "Invalid user";
        await this.chatterService.unblockChatter(user, blocked);
        return `${me} unblocked ${other}`;
    }
}
