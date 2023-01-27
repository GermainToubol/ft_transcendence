import { ChatChannel } from 'src/chat/channel/channel.entity';
import { Message } from 'src/chat/message/message.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToMany } from 'typeorm';

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @OneToOne(() => User, (user) => user.chatter)
    user: User;

    @ManyToMany(() => ChatChannel, (channel) => channel.channelAdmins)
    adminFromChannels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.bannedUsers)
    bannendFromChannels: ChatChannel[];
}
