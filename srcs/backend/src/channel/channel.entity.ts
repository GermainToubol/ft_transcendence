import { Chatter } from '../chatter/chatter.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm'
import { Message } from '../chat/message.entity';

@Entity()
export class ChannelEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    password: string;

    @ManyToOne(() => Chatter, (chatter) => chatter.ownedChannels)
    owner: Chatter;

    @ManyToMany(() => Chatter)
    @JoinTable()
    admins: Chatter[];

    @ManyToMany(() => Chatter)
    @JoinTable()
    bannedChatters: Chatter[];

    @ManyToMany(() => Chatter)
    @JoinTable()
    mutedChatters: Chatter[];

    @OneToMany(() => Message, (message) => message.channel)
    messages: Message[];
}
