import { Controller, Get } from '@nestjs/common';
import { AppointmentService } from 'src/modules/appointment-booking/application/services/appointment.service';

@Controller({
  path: 'appointments/slots/available',
  version: '1',
})
export class ListAvailableSlotsController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  listAvailableSlots() {
    return this.appointmentService.listAvailableSlots();
  }
}
