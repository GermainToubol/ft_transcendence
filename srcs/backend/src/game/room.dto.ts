import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameRoomDto {
  @IsNotEmpty()
  roomname: string;

  @IsNotEmpty()
  @IsString()
  player1: string;

  @IsNotEmpty()
  @IsString()
  player2: string;
}