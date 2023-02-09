import { Length, IsEnum, IsString } from "class-validator";
import { ChannelStatus } from "../channel/channel.entity";

export class ChatChannelDto {
  @Length(1, 255)
  @IsString()
  channelName: string;

  @IsEnum(ChannelStatus)
  channelLevel: ChannelStatus;

  @Length(0, 255)
  @IsString()
  password: string;
}
