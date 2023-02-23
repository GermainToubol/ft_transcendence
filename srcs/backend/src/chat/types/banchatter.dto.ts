import { IsNumber, IsPositive, IsString, Length } from "class-validator";
import { Entity } from "typeorm";

@Entity()
export class BanChatterDto {
  @IsString()
  @Length(1, 15)
  banLogin: string;

  @IsNumber()
  @IsPositive()
  channelId: number;
}
