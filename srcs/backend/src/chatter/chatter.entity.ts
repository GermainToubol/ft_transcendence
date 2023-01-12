import { Entity, ManyToMany, PrimaryGeneratedColumn, JoinTable } from "typeorm";

@Entity()
export class Chatter {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Chatter)
    @JoinTable()
    blocks: Chatter[];
}
