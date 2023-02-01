import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGameHistoryDto {

    @IsNotEmpty()
    @IsNumber()
    userId: number

    @IsNotEmpty()
    @IsNumber()
    opponentId: number

    @IsNotEmpty()
    @IsNumber()
    playerOneScore: number

    @IsNotEmpty()
    @IsNumber()
    playerTwoScore: number

    @IsNotEmpty()
    @IsBoolean()
    hard: boolean
}