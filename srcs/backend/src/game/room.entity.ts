import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  roomname: string

  @Column()
  player1: string

  @Column()
  player2: string

}