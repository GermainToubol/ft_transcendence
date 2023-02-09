import { IsNotEmpty, IsNumber, IsPositive, Length } from "class-validator";

export class ChatMessageDto {
  @IsNumber()
  @IsPositive()
  channel: number;

  @Length(1, 255)
  @IsNotEmpty()
  content: string;
}
