import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { IntraStrategy } from './intra.strategy';

@Module({
    providers: [AuthService, IntraStrategy],
    controllers: [AuthController]
})
export class AuthModule { }
