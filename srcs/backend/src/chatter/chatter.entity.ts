import { ChatChannel } from 'src/chat/channel/channel.entity';
import { Message } from 'src/chat/message/message.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @OneToOne(() => User, (user) => user.chatter)
    user: User;

    @OneToMany(() => ChatChannel, (channel) => channel.owner)
    ownedChannels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.channelAdmins)
    adminFromChannels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.bannedUsers)
    bannendFromChannels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.mutedUsers)
    mutedInChannels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.channelUsers)
    channels: ChatChannel[];

    @ManyToMany(() => ChatChannel, (channel) => channel.invitedUsers)
    @JoinTable()
    invitations: ChatChannel[];
}
