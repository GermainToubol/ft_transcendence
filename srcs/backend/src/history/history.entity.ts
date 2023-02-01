import { User } from "src/users/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameHistory {
	@PrimaryGeneratedColumn()
	id: number

	@JoinColumn({ name: 'userId' })
	@ManyToOne(() => User, (user) => user.gamesHistory)
	user: User

	@Column({ nullable: true })
	userId: number

	@Column({ nullable: true })
	opponentId: number

	@Column()
	playerOneScore: number

    @Column()
	playerTwoScore: number

	@Column()
	hard: boolean
}
