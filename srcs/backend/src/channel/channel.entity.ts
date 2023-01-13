import { Chatter } from '../chatter/chatter.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

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
}
