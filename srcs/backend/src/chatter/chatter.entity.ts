import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Chatter, (user) => user.blockedFrom)
    blocks: Chatter[];

    @ManyToMany(() => Chatter)
    @JoinTable()
    blockedFrom: Chatter[];
}
