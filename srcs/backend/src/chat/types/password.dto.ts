import { IsNumber, IsString, Length } from 'class-validator';

export class PasswordDto {
    @IsNumber()
    channelId: number;

    @Length(0, 255)
    @IsString()
    password: string;
}
