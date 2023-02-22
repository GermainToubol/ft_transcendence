import { IsBoolean, IsNumber, IsPositive, IsString, Length } from 'class-validator'

export class AcceptDto {
	@IsBoolean()
	accept: boolean

	@IsNumber()
	@IsPositive()
	chan: number

	@IsString()
	@Length(1, 7)
	mode: string
}