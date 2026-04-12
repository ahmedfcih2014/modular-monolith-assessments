import { Injectable } from '@nestjs/common';
import { Appointment } from 'src/modules/doctor-appointment-management/core/domain/appointment.entity';
import { UpcomingAppointmentPort } from 'src/modules/doctor-appointment-management/core/ports/upcoming-appointment.port';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class UpcomingAppointmentService implements UpcomingAppointmentPort {
  constructor(private readonly dataStore: DataStore) {}

  async execute(): Promise<Appointment[]> {
    // its for learning purpose only
    const appointments = await this.dataStore.findAll<Appointment>(
      Appointment,
      (appointment: Appointment) => !appointment.status,
    );
    const slotIds = appointments.map(
      (appointment: Appointment) => appointment.slotId,
    );
    const slots = await this.dataStore.findAll<SlotEntity>(
      SlotEntity,
      (slot: SlotEntity) => {
        return slotIds.includes(slot.id) && slot.time > new Date();
      },
    );
    return appointments.filter((appointment: Appointment) =>
      slots.some((slot: SlotEntity) => slot.id === appointment.slotId),
    );
  }
}
