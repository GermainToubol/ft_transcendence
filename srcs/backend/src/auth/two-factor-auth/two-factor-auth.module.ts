import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../../users/user.module";
import { TwoFactorAuthController } from "./two-factor-auth.controller";
import { TwoFactorAuthService } from "./two-factor-auth.service";
import { UsersService } from "src/users/user.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';
import { JwtStrategy } from "../strategies/jwt.strategy";
import { AuthService } from "../auth.service";
import { AuthModule } from "../auth.module";
import { JwtLoginStrategy } from "../strategies/jwtlogin.strategy";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
		AuthModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService, UsersService, JwtStrategy, JwtLoginStrategy, AuthService, ConfigService],
})
export class TwoFactorAuthModule { }