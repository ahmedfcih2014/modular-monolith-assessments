import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class BookAvailableSlotDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  slotId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  patientName: string;
}
