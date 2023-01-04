
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	login: string;

	@Column()
	usual_full_name: string;

	@Column()
	email: string;

    @Column({ default: false })
    is2faEnabled: boolean;

	@Column({ nullable: true })
    twoFactorAuthSecret?: string;

	@Column({ default: null })
	avatar: string;

	@Column({ default: true })
	isActive: boolean;

	// @ManyToMany() friends
	// dg sdg(( sdfg)) sdfg
}