import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BookAvailableSlotDto } from 'src/modules/appointment-booking/presentation/dto/book-available-slot.dto';
import { AppointmentEntity } from 'src/modules/appointment-booking/domain/entities/appointment.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentBookedEvent } from 'src/modules/appointment-booking/infrastructure/events/appointment-booked.event';
import {
  type IAppointmentRepo,
  IAppointmentRepoToken,
} from 'src/modules/appointment-booking/domain/repos/appointment.repo.interface';
import {
  type ISlotRepo,
  ISlotRepoToken,
} from 'src/modules/appointment-booking/domain/repos/slot.repo.interface';
import { DOCTOR_NAME } from 'src/shared/constants/system-constants.const';

@Injectable()
export class BookAvailableSlotService {
  constructor(
    @Inject(ISlotRepoToken)
    private readonly slotRepo: ISlotRepo,
    @Inject(IAppointmentRepoToken)
    private readonly appointmentRepo: IAppointmentRepo,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(bookAvailableSlotDto: BookAvailableSlotDto) {
    const slot = await this.slotRepo.findOne(bookAvailableSlotDto.slotId);
    if (!slot || slot.isReserved) {
      throw new BadRequestException('Slot is not available');
    }
    const appointment = new AppointmentEntity();
    appointment.id = randomUUID();
    appointment.slotId = slot.id;
    appointment.patientId = bookAvailableSlotDto.patientId;
    appointment.patientName = bookAvailableSlotDto.patientName;
    appointment.reservedAt = new Date();

    await this.appointmentRepo.create(appointment);
    await this.slotRepo.update(slot.id, {
      ...slot,
      isReserved: true,
    });
    this.eventEmitter.emit(
      'appointment.created',
      new AppointmentBookedEvent(appointment, slot, DOCTOR_NAME),
    );
    return { message: 'Appointment created successfully' };
  }
}
