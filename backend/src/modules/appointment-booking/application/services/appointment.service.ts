import { Injectable } from '@nestjs/common';
import { BookAvailableSlotService } from 'src/modules/appointment-booking/application/use-cases/book-available-slot.service';
import { ListAvailableSlotsService } from 'src/modules/appointment-booking/application/use-cases/list-available-slots.service';
import { BookAvailableSlotDto } from 'src/modules/appointment-booking/presentation/dto/book-available-slot.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly listAvailableSlotsService: ListAvailableSlotsService,
    private readonly bookAvailableSlotService: BookAvailableSlotService,
  ) {}

  listAvailableSlots() {
    return this.listAvailableSlotsService.execute();
  }

  bookAvailableSlot(bookAvailableSlotDto: BookAvailableSlotDto) {
    return this.bookAvailableSlotService.execute(bookAvailableSlotDto);
  }
}
