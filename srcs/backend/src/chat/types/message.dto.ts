import { IsNotEmpty, IsNumber, Length } from "class-validator";

export class ChatMessageDto {
    @IsNumber()
    channel: number;

    @Length(1, 255)
    @IsNotEmpty()
    content: string;
}
