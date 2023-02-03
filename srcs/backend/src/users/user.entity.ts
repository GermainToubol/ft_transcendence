
import { Chatter } from 'src/chatter/chatter.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, OneToOne } from 'typeorm';
import LocalFile from '../localfiles/localFile.entity';
import { UserStatus } from './user_status.enum';

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

    @JoinColumn({ name: 'avatarId' })
    @OneToOne(
        () => LocalFile,
        {
            nullable: true
        }
    )
    avatar: LocalFile;

    @Column({ nullable: true })
    avatarId: number;

    @OneToOne(() => Chatter, (chatter) => chatter.user)
    @JoinColumn()
    chatter: Chatter;

    @Column({ default: UserStatus.OFFLINE })
    status: UserStatus;
}
