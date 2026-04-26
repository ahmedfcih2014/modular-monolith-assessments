import { Inject, Injectable } from '@nestjs/common';
import {
  type ISlotRepo,
  ISlotRepoToken,
} from 'src/modules/appointment-booking/domain/repos/slot.repo.interface';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';

@Injectable()
export class ListAvailableSlotsService {
  constructor(
    @Inject(ISlotRepoToken)
    private readonly slotRepo: ISlotRepo,
  ) {}

  execute() {
    return this.slotRepo.findAll((slot: SlotEntity) => !slot.isReserved);
  }
}
