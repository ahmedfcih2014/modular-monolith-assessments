export const ICancelledAppointmentPortToken = Symbol(
  'CancelledAppointmentPort',
);

export interface CancelledAppointmentPort {
  execute(appointmentId: string): Promise<void>;
}
