import { Chatter } from 'src/chatter/chatter.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Channel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    password: string;

    owner: Chatter;

    admins: Chatter[];

    bannedChatters: Chatter[];

    mutedChatters: Chatter[];
}
