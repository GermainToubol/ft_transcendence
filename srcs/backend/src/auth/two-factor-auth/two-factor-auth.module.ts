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
import { JwtLoginStrategy } from "../strategies/jwtlogin.strategy";
import { JwtLogoutStrategy } from "../strategies/jwtlogout.strategy";
import { ConfigService } from "@nestjs/config";
import LocalFile from "src/localfiles/localFile.entity";
import { LocalFileModule } from "src/localfiles/localFiles.module";
import { ChatterModule } from "src/chatter/chatter.module";

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        LocalFileModule,
        TypeOrmModule.forFeature([User, LocalFile]),
        ChatterModule,
    ],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService, UsersService, JwtStrategy, JwtLoginStrategy, JwtLogoutStrategy, AuthService, ConfigService],
})
export class TwoFactorAuthModule { }
