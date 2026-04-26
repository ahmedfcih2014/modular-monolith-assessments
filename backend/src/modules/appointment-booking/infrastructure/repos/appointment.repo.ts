import { Injectable } from '@nestjs/common';
import { AppointmentEntity } from 'src/modules/appointment-booking/domain/entities/appointment.entity';
import { IAppointmentRepo } from 'src/modules/appointment-booking/domain/repos/appointment.repo.interface';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class AppointmentRepo implements IAppointmentRepo {
  constructor(private readonly dataStore: DataStore) {}

  create(appointment: AppointmentEntity): Promise<AppointmentEntity> {
    return this.dataStore.create(AppointmentEntity, appointment);
  }
}
