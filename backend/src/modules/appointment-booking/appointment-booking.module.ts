import { Module } from '@nestjs/common';
import { ListAvailableSlotsController } from './presentation/controllers/list-available-slots.controller';
import { ListAvailableSlotsService } from './application/use-cases/list-available-slots.service';
import { BookAvailableSlotService } from './application/use-cases/book-available-slot.service';
import { BookAvailableSlotController } from 'src/modules/appointment-booking/presentation/controllers/book-available-slot.controller';
import { AppointmentService } from 'src/modules/appointment-booking/application/services/appointment.service';
import { ISlotRepoToken } from 'src/modules/appointment-booking/domain/repos/slot.repo.interface';
import { SlotRepo } from 'src/modules/appointment-booking/infrastructure/repos/slot.repo';
import { IAppointmentRepoToken } from 'src/modules/appointment-booking/domain/repos/appointment.repo.interface';
import { AppointmentRepo } from 'src/modules/appointment-booking/infrastructure/repos/appointment.repo';

@Module({
  controllers: [ListAvailableSlotsController, BookAvailableSlotController],
  providers: [
    ListAvailableSlotsService,
    BookAvailableSlotService,
    AppointmentService,
    {
      provide: ISlotRepoToken,
      useClass: SlotRepo,
    },
    {
      provide: IAppointmentRepoToken,
      useClass: AppointmentRepo,
    },
  ],
})
export class AppointmentBookingModule {}
