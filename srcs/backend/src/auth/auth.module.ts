import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IntraStrategy } from './intra.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
    imports: [PassportModule, JwtModule.register({ secret: jwtConstants.secret, signOptions: { expiresIn: '3600s' } })],
    providers: [AuthService, IntraStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
