import {
    ForbiddenException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      private configService: ConfigService
    ) { }
  
    async create(user: UserDto): Promise<User> {
      try {
        return await this.usersRepository.save(user);
      } catch (err) {
        throw new ForbiddenException(`Forbidden: cannot create user.`);
      }
    }
  
    findAll(): Promise<User[]> {
      try {
        return this.usersRepository.find();
      } catch (err) {
        throw new NotFoundException(`Users not found`);
      }
    }
  
    async findOne(login: string): Promise<User> {
    //   try {
        const user = await this.usersRepository.findOneBy({login: login});
        if (!user) {
          return null;
        }
        return user;
    //   } catch (err) {
    //     return null;
    //   }
    }

    async remove(id: number | string): Promise<any> {
      try {
        return await this.usersRepository.delete(id);
      }
      catch (err) {
        throw new NotFoundException('User not found.');
      }
    }
  
  
    //* two factor authentication
    async turnOnOffTwoFactorAuth(id: number, bool: boolean): Promise<User> {
      try {
        await this.usersRepository.update(id, {
          is2faEnabled: bool,
        });
        const user = await this.usersRepository.findOneBy({id: id});
        if (user) {
          return user;
        }
        throw new NotFoundException('User not found');
      } catch (err) {
        throw err;
      }
    }
  
    async setTwoFactorAuthSecret(id: number, secret: string): Promise<any> {
      await this.usersRepository.update(id, {
        twoFactorAuthSecret: secret
      });
    }
  

  };
  