import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import LocalFilesService from '../localfiles/localFiles.service';
import { ChatterService } from 'src/chatter/chatter.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from './user_status.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private localFilesService: LocalFilesService,
        private chatterService: ChatterService,
        private jwtService: JwtService,
    ) { }

    async create(user: UserDto): Promise<User> {
        while (true) {
            let has_same_name = await this.usersRepository.findOneBy({ usual_full_name: user.usual_full_name });
            if (has_same_name) {
                user.usual_full_name += '_';
                continue;
            }
            let save = await this.usersRepository.save(user);
            if (!save)
                return null
            return save
        }
    }

    findAll(): Promise<User[]> {
        try {
            return this.usersRepository.find();
        } catch (err) {
            throw new NotFoundException(`Users not found`);
        }
    }

    async findOne(login: string, relations?: any): Promise<User> {
        //   try {
        let user;
        if (relations !== "undefined")
            user = await this.usersRepository.findOne({ where: { login: login }, relations: relations });
        else
            user = await this.usersRepository.findOneBy({ login: login });
        return user;
    }

    async findOneById(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({ id: id });
        if (!user) {
            return null;
        }
        return user;
    }

    async checkToken(token: string): Promise<User> {
        const check = await this.jwtService.verify(token, { publicKey: process.env.JWT_SECRET });
        if (typeof check === 'object' && 'id' in check)
            return await this.usersRepository.findOneBy({ id: check.id });
    }

    async getPseudo(login: string): Promise<string> {
        const user = await this.usersRepository.findOneBy({ login: login });
        if (!user) {
            return null;
        }
        return user.usual_full_name;
    }

    async getAvatarId(login: string): Promise<number> {
        const user = await this.usersRepository.findOneBy({ login: login });
        if (!user) {
            return 0;
        }
        if (user.avatarId === null)
            return 0;
        return user.avatarId;
    }

    async setPseudo(user: any, usual_full_name: string) {
        const check = await this.usersRepository.findOneBy({ usual_full_name: usual_full_name });
        if (check)
            return null;
        const res = await this.usersRepository.update(user.id, { usual_full_name: usual_full_name });
        return "OK";
    }

    async updateStatus(login: string, status: UserStatus): Promise<User> {
        const updated = await this.findOne(login);
        if (updated) {
            let test = await this.usersRepository.update(updated.id, { status: status });
            if (!test)
                return null;
        }
        return updated;
    }

    async addAvatar(user: any, fileData: LocalFileDto) {
        const avatar = await this.localFilesService.saveLocalFileData(fileData);
        await this.usersRepository.update(user.id, { avatarId: avatar.id })
        return (await this.findOne(user.login)).avatarId
    }

    async remove(id: number | string): Promise<any> {
        let remove = await this.usersRepository.delete(id);
    }

    //* two factor authentication
    async turnOnOffTwoFactorAuth(id: number, bool: boolean): Promise<User> {
        await this.usersRepository.update(id, { is2faEnabled: bool });
        const user = await this.usersRepository.findOneBy({ id: id });
        if (user)
            return user;
        else
            return null
    }

    async setTwoFactorAuthSecret(id: number, secret: string): Promise<any> {
        await this.usersRepository.update(id, { twoFactorAuthSecret: secret });
    }
};
