import { Chatter } from 'src/chatter/chatter.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Message } from '../message/message.entity';

export enum ChannelStatus {
  Public,
  Protected,
  Private,
  Locked
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

  @ManyToOne(() => Chatter, (chatter) => chatter.ownedChannels)
  owner: Chatter;

  @Column({ nullable: true })
  password: string;

  @ManyToMany(() => Chatter, (chatter) => chatter.channels)
  @JoinTable()
  channelUsers: Chatter[];

  @ManyToMany(() => Chatter, (chatter) => chatter.bannendFromChannels)
  @JoinTable()
  bannedUsers: Chatter[];

  @ManyToMany(() => Chatter, (chatter) => chatter.adminFromChannels)
  @JoinTable()
  channelAdmins: Chatter[];

  @ManyToMany(() => Chatter, (chatter) => chatter.mutedInChannels)
  @JoinTable()
  mutedUsers: Chatter[];

  @ManyToMany(() => Chatter, (chatter) => chatter.invitations)
  invitedUsers: Chatter[];
}
