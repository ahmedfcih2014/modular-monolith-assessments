import { Controller, Get, Inject, Param, Patch } from '@nestjs/common';
import {
  type CancelledAppointmentPort,
  ICancelledAppointmentPortToken,
} from 'src/modules/doctor-appointment-management/core/ports/cancelled-appointment.port';
import {
  type CompleteAppointmentPort,
  ICompleteAppointmentPortToken,
} from 'src/modules/doctor-appointment-management/core/ports/complete-appointment.port';
import {
  IUpcomingAppointmentPortToken,
  type UpcomingAppointmentPort,
} from 'src/modules/doctor-appointment-management/core/ports/upcoming-appointment.port';

@Controller({
  path: 'doctor/appointments',
  version: '1',
})
export class AppointmentManagementController {
  constructor(
    @Inject(IUpcomingAppointmentPortToken)
    private readonly upcomingAppointmentPort: UpcomingAppointmentPort,
    @Inject(ICompleteAppointmentPortToken)
    private readonly completeAppointmentPort: CompleteAppointmentPort,
    @Inject(ICancelledAppointmentPortToken)
    private readonly cancelledAppointmentPort: CancelledAppointmentPort,
  ) {}

  @Get('upcoming')
  async getUpcomingAppointments() {
    return this.upcomingAppointmentPort.execute();
  }

  @Patch(':appointmentId/complete')
  async completeAppointment(@Param('appointmentId') appointmentId: string) {
    return this.completeAppointmentPort.execute(appointmentId);
  }

  @Patch(':appointmentId/cancel')
  async cancelAppointment(@Param('appointmentId') appointmentId: string) {
    return this.cancelledAppointmentPort.execute(appointmentId);
  }
}
