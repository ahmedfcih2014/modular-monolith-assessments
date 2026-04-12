import { AppointmentEntity } from 'src/modules/appointment-booking/entities/appointment.entity';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';

export class AppointmentBookedEvent {
  constructor(
    public readonly appointment: AppointmentEntity,
    public readonly slot: SlotEntity,
  ) {}
}
