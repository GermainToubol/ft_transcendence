import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { jwtConstants } from './constants';

@Module({
    imports: [
		TypeOrmModule.forFeature([User]),
        PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3600s' }, }),
		UsersModule,
    ],
    controllers: [
		AuthController,
	],
    providers: [
        AuthService,
        IntraStrategy,
        UsersService,
        JwtStrategy,
        ConfigService,
    ],
})
export class AuthModule { }