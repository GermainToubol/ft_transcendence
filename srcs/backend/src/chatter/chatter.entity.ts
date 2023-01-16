import { ChannelEntity } from "../channel/channel.entity";
import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";
import { Message } from "src/chat/message.entity";

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Chatter)
    @JoinTable()
    blocks: Chatter[];

    @OneToMany(() => ChannelEntity, (channel) => channel.owner)
    ownedChannels: ChannelEntity[];

    @OneToMany(() => Message, (msg) => msg.author)
    messages: Message[];
}
