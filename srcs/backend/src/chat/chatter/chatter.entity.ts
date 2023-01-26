import { Entity, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { Message } from '../message/message.entity';
import { User } from "../../users/user.entity";

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];

    @OneToOne(() => User)
    user: User;
}
