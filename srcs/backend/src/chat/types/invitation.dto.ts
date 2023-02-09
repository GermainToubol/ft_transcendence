import { IsNumber, IsString, Length, Min } from "class-validator";

export class InvitationDto {
  @IsNumber()
  @Min(0)
  channelId: number;

  @IsString()
  @Length(1, 15)
  userLogin: string;
}
