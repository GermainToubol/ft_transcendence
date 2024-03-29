import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import axios from 'axios';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
    constructor(private authService: AuthService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.API_UID,
            clientSecret: process.env.API_SECRET,
            callbackURL: `${process.env.DOMAIN}/auth/`,
            scope: 'public',
        });
    }

    async validate(accessToken: string): Promise<any> {
        const data = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
		return data['data'];
    }

}