import { Message } from 'src/chat/message/message.entity';
import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Message, (message) => message.author)
    messages: Message[];
}
