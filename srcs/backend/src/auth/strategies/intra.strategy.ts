import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-oauth2';
import { UserDto } from "../../users/user.dto";
import { AuthService } from '../auth.service';

@Injectable()
export class IntraStrategy extends PassportStrategy(Strategy, 'intra') {
    constructor(private authService: AuthService) {
        super({
            authorizationURL: 'https://api.intra.42.fr/oauth/authorize',
            tokenURL: 'https://api.intra.42.fr/oauth/token',
            clientID: process.env.API_UID,
            clientSecret: process.env.API_SECRET,
            callbackURL: `${process.env.DOMAIN}/auth/intra`,
            scope: 'public',
            profileFields: {
                'id': function (obj: any) { return String(obj.id); },
                'username': 'login',
                'displayName': 'displayname',
                'name.familyName': 'last_name',
                'name.givenName': 'first_name',
                'profileUrl': 'url',
                'emails.0.value': 'email',
                'phoneNumbers.0.value': 'phone',
                'photos.0.value': 'image_url'
            }
        }); // Config
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
        const { id, username, emails, photos, displayName } = profile;
        const user: UserDto = {
            id: id,
            user_name: username,
            email: emails[0].value,
            display_name: displayName,
            avatar_url: photos[0].value,
        }
        done(null, user);
    }

}