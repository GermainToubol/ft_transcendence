import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException, } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import LocalFilesService from '../localfiles/localFiles.service';
import { JwtService } from '@nestjs/jwt';
import { UserStatus } from './user_status.enum';
  
  @Injectable()
  export class UsersService {
    constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
	  private localFilesService: LocalFilesService,
	  private jwtService: JwtService,
    ) { }
  
    async create(user: UserDto): Promise<User> {
		user.usual_full_name = user.usual_full_name.replace(' ', '_')
		while (true) {
			let has_same_name = await this.usersRepository.findOneBy({usual_full_name: user.usual_full_name});
			if (has_same_name) {
				user.usual_full_name += '_';
				continue ;
			}
			let save = await this.usersRepository.save(user);
			if (!save)
				return null
			return save
		}
    }
  
    async findOne(login: string): Promise<User> {
        const user = await this.usersRepository.findOneBy({login: login});
        if (!user) {
          return null;
        }
        return user;
    }

	async findOneById(id: number): Promise<User> {
        const user = await this.usersRepository.findOneBy({id: id});
        if (!user) {
          return null;
        }
        return user;
    }

	async checkToken(token:string): Promise<User> {
		const check = await this.jwtService.verify(token, {publicKey: process.env.JWT_SECRET});
		if (typeof check === 'object' && 'id' in check)
			return await this.usersRepository.findOneBy({id: check.id});
	}

	async getPseudo(login: string): Promise<string> {
		const user = await this.usersRepository.findOneBy({login: login});
		if (!user) {
		  return null;
		}
		return user.usual_full_name;
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
		const user = await this.usersRepository.findOneBy({login: login});
		if (!user) {
		  return 0;
		}
		if (user.avatarId === null)
			return 0;
		return user.avatarId;
	}

	async setPseudo(user: any, usual_full_name: string) {
		const check = await this.usersRepository.findOneBy({usual_full_name: usual_full_name});
		if (check)
			return null;
		const res = await this.usersRepository.update(user.id, { usual_full_name: usual_full_name });
		return "OK";
	}

	async updateWins(id: string, wins: number): Promise<any> {
		let test = await this.usersRepository.update(id, { wins: wins });
		if (!test)
			return null
		return test
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
        const user = await this.usersRepository.findOneBy({id: id});
        if (user)
        	return user;
		else 
			return null
    }
  
    async setTwoFactorAuthSecret(id: number, secret: string): Promise<any> {
      await this.usersRepository.update(id, { twoFactorAuthSecret: secret });
    }

	async addFriend(user: User, pseudo: string): Promise<string> {
		const friend = await this.usersRepository.findOneBy({usual_full_name: pseudo}).then()
		if (friend != null) {
			if (friend.id === user.id)
				return "You can't be friend with yourself"
			for (let i = 0; user.invitations[i]; i++) {
				if (friend.id === user.invitations[i]) {
					this.acceptFriend(user, pseudo)
					return `You added ${friend.usual_full_name}`
				}
			}
			for(let i = 0; friend.invitations[i]; i++) {
				if (user.id === friend.invitations[i])
					return "Invitation already sent"
			}
			for(let i = 0; user.friends[i]; i++) {
				if (friend.id === user.friends[i])
					return `${friend.usual_full_name} is already your friend`
			}
			friend.invitations.push(user.id)
			await this.usersRepository.update(friend.id, {invitations: friend.invitations})
			return `You sent an invitation to ${friend.usual_full_name}`
		} else {
			return "No such a player"
		}
	}

	async acceptFriend(user: User, pseudo: string): Promise<any> {
		const friend = await this.usersRepository.findOneBy({usual_full_name: pseudo}).then()
		user.friends.push(friend.id)
		await this.usersRepository.update(user.id, {friends: user.friends})
		friend.friends.push(user.id)
		await this.usersRepository.update(friend.id, {friends: friend.friends})
		for (let i = 0; user.invitations[i]; i++) {
			if (user.invitations[i] === friend.id)
				user.invitations.splice(i, 1)
		}
		await this.usersRepository.update(user.id, {invitations: user.invitations})
	}

	async declineFriend(user: User, pseudo: string): Promise<any> {
		const friend = await this.usersRepository.findOneBy({usual_full_name: pseudo}).then()
		for (let i = 0; user.invitations[i]; i++) {
			if (user.invitations[i] === friend.id)
				user.invitations.splice(i, 1)
		}
		await this.usersRepository.update(user.id, {invitations: user.invitations})
	}

	async removeFriend(user: User, pseudo: string): Promise<any> {
		const friend = await this.usersRepository.findOneBy({usual_full_name: pseudo}).then()
		for (let i = 0; user.friends[i]; i++) {
			if (user.friends[i] === friend.id)
				user.friends.splice(i, 1)
		}
		for (let i = 0; friend.friends[i]; i++) {
			if (friend.friends[i] === user.id)
				friend.friends.splice(i, 1)
		}
		await this.usersRepository.update(user.id, {friends: user.friends})
		await this.usersRepository.update(friend.id, {friends: friend.friends})
	}

	async getFriends(user: User): Promise<any> {
		let friends = []
		for (let i = 0; user.friends[i]; i++) {
			let friend = await this.usersRepository.findOneBy({id: user.friends[i]}).then()
			if (friend != null) {
				let item = {
					pseudo: friend.usual_full_name,
					avatar: friend.avatarId,
					wins: friend.wins,
					status: friend.status
				}
				friends[i] = item	
			}
		}
		return friends
	}

	async getInvitations(user: User): Promise<any> {
		let invitations = []
		for (let i = 0; user.invitations[i]; i++) {
			let friend = await this.usersRepository.findOneBy({id: user.invitations[i]}).then()
			if (friend != null) {
				let item = {
					pseudo: friend.usual_full_name,
					avatar: friend.avatarId
				}
				invitations[i] = item	
			}
		}
		return invitations
	}
};
  