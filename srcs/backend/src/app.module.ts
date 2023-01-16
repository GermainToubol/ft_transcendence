import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { User } from './users/user.entity';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import LocalFile from './localfiles/localFile.entity';
import { LocalFileModule } from './localfiles/localFiles.module';
import { ChatterModule } from './chatter/chatter.module';
import { Chatter } from './chatter/chatter.entity';
import { ChannelModule } from './channel/channel.module';
import { ChannelEntity } from './channel/channel.entity';
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/message.entity';

@Module({
    imports: [
        AuthModule,
        TwoFactorAuthModule,
        UsersModule,
        LocalFileModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'database.backend-net',
            port: 5432,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User, LocalFile, Chatter, ChannelEntity, Message],
            synchronize: true,
        }),
        ChatterModule,
        ChannelModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) { }
}
