import { AppointmentEntity } from 'src/modules/appointment-booking/entities/appointment.entity';

export enum AppointmentStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class Appointment extends AppointmentEntity {}
