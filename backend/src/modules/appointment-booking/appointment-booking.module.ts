import { Module } from '@nestjs/common';
import { ListAvailableSlotsController } from './controllers/list-available-slots.controller';
import { ListAvailableSlotsService } from './use-cases/list-available-slots.service';
import { BookAvailableSlotService } from './use-cases/book-available-slot.service';
import { BookAvailableSlotController } from 'src/modules/appointment-booking/controllers/book-available-slot.controller';

@Module({
  controllers: [ListAvailableSlotsController, BookAvailableSlotController],
  providers: [ListAvailableSlotsService, BookAvailableSlotService],
})
export class AppointmentBookingModule {}
