import { IsNumber, Min } from 'class-validator';

export class LeaveDto {
    @IsNumber()
    @Min(0)
    channelId: number;
}
