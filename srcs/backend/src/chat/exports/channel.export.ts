import { ChannelStatus } from "../channel/channel.entity";

export class ChannelExport {
    id: number;
    channelName: string;
    channelAdm: boolean;
    channelStatus: ChannelStatus;
    hasPasswd: boolean;
    channelUser: boolean;
}
