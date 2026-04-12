import { Module } from '@nestjs/common';
import { ICancelledAppointmentPortToken } from 'src/modules/doctor-appointment-management/core/ports/cancelled-appointment.port';
import { ICompleteAppointmentPortToken } from 'src/modules/doctor-appointment-management/core/ports/complete-appointment.port';
import { IUpcomingAppointmentPortToken } from 'src/modules/doctor-appointment-management/core/ports/upcoming-appointment.port';
import { CancelledAppointmentService } from 'src/modules/doctor-appointment-management/core/use-cases/cancelled-apppointment.service';
import { CompleteAppointmentService } from 'src/modules/doctor-appointment-management/core/use-cases/complete-apppointment.service';
import { UpcomingAppointmentService } from 'src/modules/doctor-appointment-management/core/use-cases/upcoming-appointment.service';
import { AppointmentManagementController } from './shell/controllers/appointment-management.controller';

@Module({
  providers: [
    {
      provide: IUpcomingAppointmentPortToken,
      useClass: UpcomingAppointmentService,
    },
    {
      provide: ICompleteAppointmentPortToken,
      useClass: CompleteAppointmentService,
    },
    {
      provide: ICancelledAppointmentPortToken,
      useClass: CancelledAppointmentService,
    },
  ],
  controllers: [AppointmentManagementController],
})
export class DoctorAppointmentManagementModule {}
