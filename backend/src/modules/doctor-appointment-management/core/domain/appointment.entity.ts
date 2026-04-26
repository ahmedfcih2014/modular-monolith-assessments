import { AppointmentEntity } from 'src/modules/appointment-booking/domain/entities/appointment.entity';

export enum AppointmentStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class Appointment extends AppointmentEntity {}
