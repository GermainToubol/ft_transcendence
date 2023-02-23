import { IsString, Length } from 'class-validator';

export class PrivateDto {
  @IsString()
  @Length(1, 15)
  userLogin: string;
}
