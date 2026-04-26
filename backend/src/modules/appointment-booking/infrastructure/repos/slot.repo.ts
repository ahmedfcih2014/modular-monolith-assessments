import { Injectable } from '@nestjs/common';
import { ISlotRepo } from 'src/modules/appointment-booking/domain/repos/slot.repo.interface';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class SlotRepo implements ISlotRepo {
  constructor(private readonly dataStore: DataStore) {}

  findAll(filter?: (entity: SlotEntity) => boolean): Promise<SlotEntity[]> {
    return this.dataStore.findAll(SlotEntity, filter);
  }

  findOne(id: string): Promise<SlotEntity> {
    return this.dataStore.findOne(SlotEntity, id);
  }

  update(id: string, slot: SlotEntity): Promise<SlotEntity> {
    return this.dataStore.update(SlotEntity, id, slot);
  }
}
