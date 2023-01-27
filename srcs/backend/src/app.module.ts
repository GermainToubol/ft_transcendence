import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { User } from './users/user.entity';
import { TwoFactorAuthModule } from './auth/two-factor-auth/two-factor-auth.module';
import LocalFile from './localfiles/localFile.entity';
import { LocalFileModule } from './localfiles/localFiles.module';
import { GameModule } from './game/game.module';
import { Room } from './game/room.entity';
import { GameHistory } from './history/history.entity';
import { GameHistoryModule } from './history/history.module';
import { ChatModule } from './chat/chat.module';
import { Message } from './chat/message/message.entity';
import { ChatChannel } from './chat/channel/channel.entity';
import { ChatterModule } from './chatter/chatter.module';
import { Chatter } from './chatter/chatter.entity';

@Module({
    imports: [
        AuthModule,
        TwoFactorAuthModule,
        UsersModule,
  LocalFileModule,
  GameModule,
		GameHistoryModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'database.backend-net',
            port: 5432,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          entities: [User, LocalFile, Message, Room, GameHistory, ChatChannel, Chatter],
            synchronize: true,
        }),
        ChatModule,
        ChatterModule,
    ],
    controllers: [],
    providers: [],
})

export class AppModule {
}
