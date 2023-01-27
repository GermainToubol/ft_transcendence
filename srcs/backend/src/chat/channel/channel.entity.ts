import { Chatter } from 'src/chatter/chatter.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Message } from '../message/message.entity';

export enum ChannelStatus {
    Public,
    Protected,
    Private,
}

@Entity()
export class ChatChannel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    channelName: string;

    @Column()
    channelStatus: ChannelStatus;

    @OneToMany(() => Message, (message) => message.channel)
    messages: Message[];

    @ManyToMany(() => Chatter, (chatter) => chatter.bannendFromChannels)
    @JoinTable()
    bannedUsers: Chatter[];

    @ManyToMany(() => Chatter, (chatter) => chatter.adminFromChannels)
    @JoinTable()
    channelAdmins: Chatter[];
}
