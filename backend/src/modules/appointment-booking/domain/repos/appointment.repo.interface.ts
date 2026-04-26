import { AppointmentEntity } from 'src/modules/appointment-booking/domain/entities/appointment.entity';

export const IAppointmentRepoToken = Symbol('IAppointmentRepo');

export interface IAppointmentRepo {
  create(appointment: AppointmentEntity): Promise<AppointmentEntity>;
}
