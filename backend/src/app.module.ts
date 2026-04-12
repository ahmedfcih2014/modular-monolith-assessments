import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/api/health.controller';
import { DoctorAvailabilityModule } from './modules/doctor-availability/doctor-availability.module';
import { AppointmentBookingModule } from './modules/appointment-booking/appointment-booking.module';
import { DoctorAppointmentManagementModule } from './modules/doctor-appointment-management/doctor-appointment-management.module';
import { AppointmentConfirmationModule } from './modules/appointment-confirmation/appointment-confirmation.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DataStore } from './shared/data-store';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    DoctorAvailabilityModule,
    AppointmentBookingModule,
    DoctorAppointmentManagementModule,
    AppointmentConfirmationModule,
    EventEmitterModule.forRoot(),
    SharedModule,
  ],
  controllers: [HealthController],
  providers: [DataStore],
})
export class AppModule {}
