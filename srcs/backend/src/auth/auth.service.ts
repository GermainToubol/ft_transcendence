import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
    verifyUser(login: string): string {
        if (!login || login == 'meyro')
            throw new UnauthorizedException();
        return login;
    }
}
