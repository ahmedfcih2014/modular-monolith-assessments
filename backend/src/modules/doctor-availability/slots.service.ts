import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { CreateSlotDto } from 'src/modules/doctor-availability/dto/create-slot.dto';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { DataStore } from 'src/shared/data-store';

@Injectable()
export class SlotsService {
  constructor(private readonly dataStore: DataStore) {}

  getSlots() {
    return this.dataStore.findAll<SlotEntity>(SlotEntity);
  }

  createSlot(createSlotDto: CreateSlotDto) {
    const slot = new SlotEntity();
    slot.id = randomUUID();
    slot.time = createSlotDto.time;
    slot.doctorId = createSlotDto.doctorId;
    slot.isReserved = createSlotDto.isReserved;
    slot.cost = createSlotDto.cost;
    return this.dataStore.create(SlotEntity, slot);
  }
}
