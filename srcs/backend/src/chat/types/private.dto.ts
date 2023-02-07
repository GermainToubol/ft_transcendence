import { IsString, Length } from 'class-validator';

export class PrivateDto {
  @IsString()
  @Length(1, 255)
  userLogin: string;
}
