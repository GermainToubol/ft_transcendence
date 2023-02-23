import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../type/jwt-payload.type';
import { jwtConstants } from '../constants';

@Injectable()
export class JwtLogoutStrategy extends PassportStrategy(Strategy, 'jwtlogout') {
  constructor(
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw done(new HttpException('Invalid token', HttpStatus.UNAUTHORIZED));
    }
    return done(null, user);
  }
}