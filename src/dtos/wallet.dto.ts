import {  IsString, IsNotEmpty,  IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  public avatarType: number
}
