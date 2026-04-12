export const ICompleteAppointmentPortToken = Symbol('ICompleteAppointmentPort');

export interface CompleteAppointmentPort {
  execute(appointmentId: string): Promise<void>;
}
