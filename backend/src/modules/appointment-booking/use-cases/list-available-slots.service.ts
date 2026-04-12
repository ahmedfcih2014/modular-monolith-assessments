import { Injectable } from '@nestjs/common';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class ListAvailableSlotsService {
  constructor(private readonly dataStore: DataStore) {}

  execute() {
    return this.dataStore.findAll(
      SlotEntity,
      (slot: SlotEntity) => !slot.isReserved,
    );
  }
}
