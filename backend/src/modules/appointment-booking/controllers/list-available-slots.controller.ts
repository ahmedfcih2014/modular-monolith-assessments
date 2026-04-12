import { Controller, Get } from '@nestjs/common';
import { ListAvailableSlotsService } from 'src/modules/appointment-booking/use-cases/list-available-slots.service';

@Controller({
  path: 'appointments/slots/available',
  version: '1',
})
export class ListAvailableSlotsController {
  constructor(
    private readonly listAvailableSlotsService: ListAvailableSlotsService,
  ) {}

  @Get()
  listAvailableSlots() {
    return this.listAvailableSlotsService.execute();
  }
}
