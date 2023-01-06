import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/user.module';
import { UsersService } from '../users/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { IntraStrategy } from './strategies/intra.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { jwtConstants } from './constants';

@Module({
    imports: [
		TypeOrmModule.forFeature([User]),
        PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: jwtConstants.expire }, }),
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
    ],
})
export class AuthModule { }