import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateSlotDto } from 'src/modules/doctor-availability/dto/create-slot.dto';
import { SlotsService } from 'src/modules/doctor-availability/slots.service';

@Controller({
  path: 'availability/slots',
  version: '1',
})
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Get()
  getSlots() {
    return this.slotsService.getSlots();
  }

  @Post()
  createSlot(@Body() createSlotDto: CreateSlotDto) {
    return this.slotsService.createSlot(createSlotDto);
  }
}
