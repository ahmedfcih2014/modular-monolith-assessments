import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookAvailableSlotDto } from 'src/modules/appointment-booking/dto/book-available-slot.dto';
import { AppointmentEntity } from 'src/modules/appointment-booking/entities/appointment.entity';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { DataStore } from 'src/shared/data-store';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentBookedEvent } from 'src/modules/appointment-booking/events/appointment-booked.event';

@Injectable()
export class BookAvailableSlotService {
  constructor(
    private readonly dataStore: DataStore,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(bookAvailableSlotDto: BookAvailableSlotDto) {
    const slot = await this.dataStore.findOne<SlotEntity>(
      SlotEntity,
      bookAvailableSlotDto.slotId,
    );
    if (!slot || slot.isReserved) {
      throw new BadRequestException('Slot is not available');
    }
    const appointment = new AppointmentEntity();
    appointment.id = randomUUID();
    appointment.slotId = slot.id;
    appointment.patientId = bookAvailableSlotDto.patientId;
    appointment.patientName = bookAvailableSlotDto.patientName;
    appointment.reservedAt = new Date();

    await this.dataStore.create(AppointmentEntity, appointment);
    await this.dataStore.update<SlotEntity>(SlotEntity, slot.id, {
      isReserved: true,
    } as SlotEntity);
    this.eventEmitter.emit(
      'appointment.created',
      new AppointmentBookedEvent(appointment, slot),
    );
    return { message: 'Appointment created successfully' };
  }
}
