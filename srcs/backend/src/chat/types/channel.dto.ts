import { Length, IsEnum } from "class-validator";
import { ChannelStatus } from "../channel/channel.entity";

export class ChatChannelDto {
    @Length(1, 255)
    channelName: string

    @IsEnum(ChannelStatus)
    channelLevel: ChannelStatus;
}
