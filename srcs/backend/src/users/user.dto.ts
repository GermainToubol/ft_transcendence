import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUrl
} from "class-validator";
import { Chatter } from "src/chatter/chatter.entity";

export class UserDto {
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    usual_full_name?: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    display_name?: string;

    @IsUrl()
    @IsNotEmpty()
    avatar_url?: string;

    chatter?: Chatter;
}
