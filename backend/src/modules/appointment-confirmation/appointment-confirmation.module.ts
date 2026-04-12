import { Module } from '@nestjs/common';
import { AppointmentBookedProcessor } from 'src/modules/appointment-confirmation/processors/appointment-booked.processor';

@Module({
  providers: [AppointmentBookedProcessor],
})
export class AppointmentConfirmationModule {}
