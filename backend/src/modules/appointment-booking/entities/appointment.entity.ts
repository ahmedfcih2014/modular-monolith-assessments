export enum AppointmentStatus {
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class AppointmentEntity {
  id: string;
  slotId: string;
  patientId: string;
  patientName: string;
  reservedAt: Date;
  status?: AppointmentStatus;
  completedAt?: Date;
  cancelledAt?: Date;
}
