import { Appointment } from 'src/modules/doctor-appointment-management/core/domain/appointment.entity';

export const IUpcomingAppointmentPortToken = Symbol('UpcomingAppointmentPort');

export interface UpcomingAppointmentPort {
  execute(): Promise<Appointment[]>;
}
