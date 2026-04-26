import { Body, Controller, Post } from '@nestjs/common';
import { BookAvailableSlotDto } from 'src/modules/appointment-booking/presentation/dto/book-available-slot.dto';
import { AppointmentService } from 'src/modules/appointment-booking/application/services/appointment.service';

@Controller({
  path: 'appointments',
  version: '1',
})
export class BookAvailableSlotController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  bookAvailableSlot(@Body() bookAvailableSlotDto: BookAvailableSlotDto) {
    return this.appointmentService.bookAvailableSlot(bookAvailableSlotDto);
  }
}
