import { IsNumber, IsPositive, IsString, Length } from 'class-validator';

export class PasswordDto {
  @IsNumber()
  @IsPositive()
  channelId: number;

  @Length(0, 255)
  @IsString()
  password: string;
}
