import { IsString, IsNotEmpty, IsNumber,  IsMongoId,  } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public market: string

  @IsString()
  @IsNotEmpty()
  public symbol: string;

  @IsNumber()
  public price: number;

  @IsString()
  @IsNotEmpty()
  public currency: string;

  @IsNumber()
  public amount: number;

  @IsMongoId()
  public walletId: string;
}


export class UpdateAssetDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsNumber()
  public amount: number;

  @IsNumber()
  public price: number;
}

export class RemoveAssetDto {
  @IsString()
  @IsNotEmpty()
  public id: string;
}

export class RemovePortfoliotDto {
  @IsString()
  @IsNotEmpty()
  public walletId: string;

  @IsString()
  @IsNotEmpty()
  public name: string;
}