import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UserDto } from './user.dto'
import { User } from './user.entity'
import LocalFilesService from '../localfiles/localFiles.service'
import { JwtService } from '@nestjs/jwt'
import { UserStatus } from './user_status.enum'
import { ChatterService } from 'src/chatter/chatter.service'
import { Chatter } from 'src/chatter/chatter.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
	  private localFilesService: LocalFilesService,
	  private jwtService: JwtService,
    private chatterService: ChatterService
  ) { }

  async create(user: UserDto): Promise<User> {
		const chatter = await this.chatterService.create();
    if (!chatter)
      return null
    user.usual_full_name = user.usual_full_name.replace(' ', '_')
		while (true) {
			let has_same_name = await this.usersRepository.findOneBy({usual_full_name: user.usual_full_name})
			if (has_same_name) {
				user.usual_full_name += '_'
				continue
			}
      user.chatter = chatter;
			let save = await this.usersRepository.save(user)
			if (!save)
				return null
			return save
		}
    }

    async findOne(login: string, relations?: any): Promise<User> {
        let user;
        if (relations !== "undefined")
            user = await this.usersRepository.findOne({ where: { login: login }, relations: relations });
        else
            user = await this.usersRepository.findOneBy({ login: login });
        if (!user) {
          return null
        }
        return user
    }

	async findOneById(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: id})
        if (!user) {
          return null
        }
        return user
    }

	async checkToken(token:string): Promise<User> {
		const check = await this.jwtService.verify(token, {publicKey: process.env.JWT_SECRET})
		if (typeof check === 'object' && 'id' in check)
			return await this.usersRepository.findOneBy({id: check.id})
	}

	async getPseudo(login: string): Promise<string> {
		const user = await this.usersRepository.findOneBy({login: login})
		if (!user) {
		  return null
		}
		return user.usual_full_name
	}

	async getHistory(pseudo: string): Promise<any> {
		const users = await this.usersRepository.find({
			relations: ['gamesHistory'],
			where: { usual_full_name: pseudo },
		  })
		if (!users) {
		  return null
		}
		let history = []
		let size = users[0].gamesHistory.length
		for (let i = size -  1, k = 0; i >= 0; i--, k++) {
			let opponent = await this.findOneById(users[0].gamesHistory[i].opponentId).then()
			let test = {
				opponentPseudo: opponent.usual_full_name,
				opponentAvatar: opponent.avatarId,
				playerOneScore: users[0].gamesHistory[i].playerOneScore,
				playerTwoScore: users[0].gamesHistory[i].playerTwoScore,
				hard: users[0].gamesHistory[i].hard,
				victory: users[0].gamesHistory[i].playerOneScore > users[0].gamesHistory[i].playerTwoScore ? true : false
			}
			history[k] = test
		}
		return history
	}

	async getLeaderboard(): Promise<any> {
		const users = await this.usersRepository.find()
		let leaderboard = []
		for (let i = 0; users[i] != null; i++) {
			let test = {
				pseudo: users[i].usual_full_name,
				avatar: users[i].avatarId,
				wins: users[i].wins
			}
			leaderboard[i] = test
		}
		return leaderboard.sort((a, b) => (a.wins < b.wins ? 1 : -1))
	}

	async getAvatarId(login: string): Promise<number> {
		const user = await this.usersRepository.findOneBy({login: login})
		if (!user) {
		  return 0
		}
		if (user.avatarId === null)
			return 0
		return user.avatarId
	}

	async setPseudo(user: any, usual_full_name: string) {
		const check = await this.usersRepository.findOneBy({usual_full_name: usual_full_name})
		if (check)
			return null
		const res = await this.usersRepository.update(user.id, { usual_full_name: usual_full_name })
		return "OK"
	}

	async updateWins(id: string, wins: number): Promise<any> {
		let test = await this.usersRepository.update(id, { wins: wins })
		if (!test)
			return null
		return test
	}

	async updateStatus(login: string, status: UserStatus): Promise<User> {
		const updated = await this.findOne(login)
		if (updated) {
			let test = await this.usersRepository.update(updated.id, { status: status })
			if (!test)
				return null
		}
		return updated
	}

	async addAvatar(user: any, fileData: LocalFileDto) {
		const avatar = await this.localFilesService.saveLocalFileData(fileData)
		await this.usersRepository.update(user.id, { avatarId: avatar.id })
		return (await this.findOne(user.login)).avatarId
	  }

    async remove(id: number | string): Promise<any> {
        let remove = await this.usersRepository.delete(id)
    }

    //* two factor authentication
    async turnOnOffTwoFactorAuth(id: number, bool: boolean): Promise<User> {
        await this.usersRepository.update(id, { is2faEnabled: bool })
        const user = await this.usersRepository.findOneBy({id: id})
        if (user)
        	return user
		else
			return null
    }

    async setTwoFactorAuthSecret(id: number, secret: string): Promise<any> {
      await this.usersRepository.update(id, { twoFactorAuthSecret: secret })
    }
}
