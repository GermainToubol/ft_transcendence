import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "../../users/users.module";
import { TwoFactorAuthController } from "./two-factor-auth.controller";
import { TwoFactorAuthService } from "./two-factor-auth.service";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../users/user.entity';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [TwoFactorAuthController],
    providers: [TwoFactorAuthService, ConfigService, UsersService],
})
export class TwoFactorAuthModule { }