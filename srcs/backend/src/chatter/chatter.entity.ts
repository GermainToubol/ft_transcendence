import { Message } from 'src/chat/message/message.entity';
import { User } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @OneToOne(() => User, (user) => user.chatter)
    user: User;
}
