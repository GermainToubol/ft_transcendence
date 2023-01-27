import { Chatter } from 'src/chatter/chatter.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatChannel } from '../channel/channel.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => ChatChannel, (chan) => chan.messages)
    channel: ChatChannel;

    @ManyToOne(() => Chatter, (chatter) => chatter.messages)
    author: Chatter;
}
