import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Appointment,
  AppointmentStatus,
} from 'src/modules/doctor-appointment-management/core/domain/appointment.entity';
import { CancelledAppointmentPort } from 'src/modules/doctor-appointment-management/core/ports/cancelled-appointment.port';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class CancelledAppointmentService implements CancelledAppointmentPort {
  constructor(private readonly dataStore: DataStore) {}

  async execute(appointmentId: string) {
    const appointment = await this.dataStore.findOne<Appointment>(
      Appointment,
      appointmentId,
    );
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (appointment.status) {
      throw new BadRequestException(
        'Appointment is already ' + appointment.status,
      );
    }

    await this.dataStore.update(Appointment, appointmentId, {
      status: AppointmentStatus.CANCELLED,
      cancelledAt: new Date(),
    });
  }
}
