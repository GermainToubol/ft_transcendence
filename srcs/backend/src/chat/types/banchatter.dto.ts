import { IsNumber, IsPositive, IsString } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class BanChatterDto {
    @IsString()
    banLogin: string;

    @IsNumber()
    @IsPositive()
    channelId: number;
}
