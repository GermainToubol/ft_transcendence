import { ChannelEntity } from "../channel/channel.entity";
import { Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Chatter)
    @JoinTable()
    blocks: Chatter[];

    @OneToMany(() => ChannelEntity, (channel) => channel.owner)
    ownedChannels: ChannelEntity[];
}
