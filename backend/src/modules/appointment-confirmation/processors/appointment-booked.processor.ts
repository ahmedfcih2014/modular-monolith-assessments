import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppointmentBookedEvent } from 'src/modules/appointment-booking/infrastructure/events/appointment-booked.event';

@Injectable()
export class AppointmentBookedProcessor {
  @OnEvent('appointment.created')
  handleAppointmentCreatedEvent(payload: AppointmentBookedEvent) {
    console.log('--------------------------------------------------');
    console.log(`Appointment created: ${payload.appointment.id}`);
    console.log('--------------------------------------------------');
    console.log(`Slot: ${payload.slot.id}`);
    console.log(`Patient: ${payload.appointment.patientName}`);
    console.log(`Doctor: ${payload.doctorName}, ${payload.slot.doctorId}`);
    console.log(`Time: ${payload.slot.time.toISOString()}`);
    console.log(`Cost: ${payload.slot.cost}`);
    console.log('--------------------------------------------------');
  }
}
