import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
}
