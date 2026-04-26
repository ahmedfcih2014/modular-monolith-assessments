import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';

export const ISlotRepoToken = Symbol('ISlotRepo');

export interface ISlotRepo {
  findAll(filter?: (entity: SlotEntity) => boolean): Promise<SlotEntity[]>;
  findOne(id: string): Promise<SlotEntity>;
  update(id: string, slot: SlotEntity): Promise<SlotEntity>;
}
