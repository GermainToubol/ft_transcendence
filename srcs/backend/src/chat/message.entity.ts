import { ChannelEntity } from 'src/channel/channel.entity';
import { Chatter } from 'src/chatter/chatter.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @ManyToOne(() => Chatter, (chatter) => chatter.messages)
    author: Chatter

    @ManyToOne(() => ChannelEntity, (channel) => channel.messages)
    channel: ChannelEntity;
}
