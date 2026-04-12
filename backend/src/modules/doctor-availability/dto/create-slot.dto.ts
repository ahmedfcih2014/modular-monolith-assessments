import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  @IsDateString()
  time: Date;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  doctorId: string;

  @IsNotEmpty()
  @IsBoolean()
  isReserved: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cost: number;
}
