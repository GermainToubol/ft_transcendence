import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async verifyUser(userlogin: string): Promise<any> {
        if (!userlogin || userlogin == 'meyro')
            throw new UnauthorizedException();
        return { username: userlogin, sub: 12 };
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
