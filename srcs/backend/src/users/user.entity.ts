import { GameHistory } from 'src/history/history.entity'
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne, OneToMany } from 'typeorm'
import LocalFile from '../localfiles/localFile.entity'
import { UserStatus } from './user_status.enum'

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	login: string

	@Column()
	usual_full_name: string

	@Column()
	email: string

    @Column({ default: false })
    is2faEnabled: boolean

	@Column({ nullable: true })
    twoFactorAuthSecret?: string

	@JoinColumn({ name: 'avatarId' })
	@OneToOne(() => LocalFile, { nullable: true })
	avatar: LocalFile

	@Column({ nullable: true })
	avatarId: number

	@OneToMany(() => GameHistory, (gameHistory) => gameHistory.user)
	gamesHistory: GameHistory[]

	@Column({ default: true })
	isActive: boolean

	@Column({ default: UserStatus.OFFLINE })
	status: UserStatus

	@Column({ default: 0 })
	wins: number
}