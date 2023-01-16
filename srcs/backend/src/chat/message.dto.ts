import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";

export class MessageDto {
    @IsNumber()
    userId: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    channelId: number;
}
