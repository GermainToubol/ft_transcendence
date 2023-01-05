import {
    IsAlphanumeric,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
    IsUrl
} from "class-validator";

export class UserDto {
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    user_name?: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email?: string;

    @IsString()
    display_name?: string;

    @IsUrl()
    @IsNotEmpty()
    avatar_url?: string;
}
