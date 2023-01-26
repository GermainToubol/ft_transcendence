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
import { GameGateway } from './game/game.gateway';
import { GameModule } from './game/game.module';
import { GameService } from './game/game.service';
import { LobbyService } from './game/lobby.service';
import { UsersService } from './users/user.service';
import { Room } from './game/room.entity';

@Module({
    imports: [
		AuthModule,
		TwoFactorAuthModule,
		UsersModule,
		LocalFileModule,
		GameModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'database.backend-net',
			port: 5432,
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			entities: [User, LocalFile, Room],
			synchronize: true,
		}),
	],
    controllers: [],
    providers: [],
})
export class AppModule {
}
