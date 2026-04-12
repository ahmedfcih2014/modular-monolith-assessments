import { Body, Controller, Post } from '@nestjs/common';
import { BookAvailableSlotDto } from 'src/modules/appointment-booking/dto/book-available-slot.dto';
import { BookAvailableSlotService } from 'src/modules/appointment-booking/use-cases/book-available-slot.service';

@Controller({
  path: 'appointments',
  version: '1',
})
export class BookAvailableSlotController {
  constructor(
    private readonly bookAvailableSlotService: BookAvailableSlotService,
  ) {}

  @Post()
  bookAvailableSlot(@Body() bookAvailableSlotDto: BookAvailableSlotDto) {
    return this.bookAvailableSlotService.execute(bookAvailableSlotDto);
  }
}
