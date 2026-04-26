import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppointmentEntity } from 'src/modules/appointment-booking/domain/entities/appointment.entity';
import { SlotEntity } from 'src/modules/doctor-availability/entities/slot.entity';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

type EntityClass = typeof SlotEntity | typeof AppointmentEntity;

interface PersistedState {
  slots: SlotEntity[];
  appointments: AppointmentEntity[];
}

@Injectable()
export class DataStore implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DataStore.name);
  private readonly filePath = path.join(
    process.cwd(),
    'data',
    'data-store.json',
  );

  private slots: SlotEntity[] = [];
  private appointments: AppointmentEntity[] = [];

  /** Ensures only one disk write runs at a time so concurrent saves cannot reorder and overwrite newer state. */
  private saveMutex = Promise.resolve();

  async onModuleInit(): Promise<void> {
    await this.loadFromDisk();
  }

  async onModuleDestroy(): Promise<void> {
    await this.saveToDisk(true);
  }

  async create<T>(entityClass: EntityClass, entity: T): Promise<T> {
    if (entityClass === SlotEntity) {
      this.slots.push(entity as SlotEntity);
      await this.saveToDisk();
      return entity;
    }
    if (entityClass === AppointmentEntity) {
      this.appointments.push(entity as AppointmentEntity);
      await this.saveToDisk();
      return entity;
    }
    throw new BadRequestException('Unknown entity class');
  }

  findAll<T>(
    entityClass: EntityClass,
    filter?: (entity: T) => boolean,
  ): Promise<T[]> {
    if (entityClass === SlotEntity) {
      const slots = [...this.slots] as T[];
      if (filter) {
        return Promise.resolve(slots.filter(filter));
      }
      return Promise.resolve(slots);
    }
    if (entityClass === AppointmentEntity) {
      const appointments = [...this.appointments] as T[];
      if (filter) {
        return Promise.resolve(appointments.filter(filter));
      }
      return Promise.resolve(appointments);
    }
    throw new BadRequestException('Unknown entity class');
  }

  findOne<T>(entityClass: EntityClass, id: string): Promise<T> {
    if (entityClass === SlotEntity) {
      const slot = this.slots.find((s) => s.id === id);
      if (slot) {
        return Promise.resolve(slot as T);
      }
    }
    if (entityClass === AppointmentEntity) {
      const appointment = this.appointments.find((a) => a.id === id);
      if (appointment) {
        return Promise.resolve(appointment as T);
      }
    }
    throw new NotFoundException(`No entity with id ${id}`);
  }

  async update<T>(entityClass: EntityClass, id: string, entity: T): Promise<T> {
    if (entityClass === SlotEntity) {
      const slotIdx = this.slots.findIndex((s) => s.id === id);
      if (slotIdx !== -1) {
        this.slots[slotIdx] = { ...this.slots[slotIdx], ...entity };
        await this.saveToDisk();
        return this.slots[slotIdx] as T;
      }
    }
    if (entityClass === AppointmentEntity) {
      const apptIdx = this.appointments.findIndex((a) => a.id === id);
      if (apptIdx !== -1) {
        this.appointments[apptIdx] = {
          ...this.appointments[apptIdx],
          ...entity,
        };
        await this.saveToDisk();
        return this.appointments[apptIdx] as T;
      }
    }
    throw new NotFoundException(`No ${entityClass.name} with id ${id}`);
  }

  async remove(entityClass: EntityClass, id: string): Promise<void> {
    if (entityClass === SlotEntity) {
      const slotIdx = this.slots.findIndex((s) => s.id === id);
      if (slotIdx !== -1) {
        this.slots.splice(slotIdx, 1);
        await this.saveToDisk();
        return;
      }
    }
    if (entityClass === AppointmentEntity) {
      const apptIdx = this.appointments.findIndex((a) => a.id === id);
      if (apptIdx !== -1) {
        this.appointments.splice(apptIdx, 1);
        await this.saveToDisk();
        return;
      }
    }
    throw new NotFoundException(`No ${entityClass.name} with id ${id}`);
  }

  private async loadFromDisk(): Promise<void> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as unknown;
      if (!this.isPersistedState(parsed)) {
        this.logger.warn(
          `Invalid shape in ${this.filePath}; starting with empty store`,
        );
        return;
      }
      this.slots = parsed.slots.map((s) => this.reviveSlot(s));
      this.appointments = parsed.appointments.map((a) =>
        this.reviveAppointment(a),
      );
      this.logger.log(`Loaded store from ${this.filePath}`);
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === 'ENOENT') {
        this.logger.log(
          `No existing store at ${this.filePath}; starting empty`,
        );
        return;
      }
      this.logger.warn(
        `Could not read ${this.filePath}; starting empty (${String(err)})`,
      );
    }
  }

  /**
   * Writes current state to disk. Mutations run concurrently; this queues actual I/O so the last
   * completed write always reflects the latest in-memory arrays (no lost updates).
   * `logOnSuccess` is for shutdown-only logging.
   */
  private async saveToDisk(logOnSuccess = false): Promise<void> {
    const job = this.saveMutex.then(() => this.writeStateToFile(logOnSuccess));
    this.saveMutex = job.catch(() => undefined);
    await job;
  }

  private async writeStateToFile(logOnSuccess: boolean): Promise<void> {
    const state: PersistedState = {
      slots: this.slots,
      appointments: this.appointments,
    };
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    const payload = JSON.stringify(state, null, 2);
    const tmpPath = path.join(dir, `.data-store-${randomUUID()}.tmp`);
    try {
      await fs.writeFile(tmpPath, payload, 'utf-8');
      await fs.rename(tmpPath, this.filePath);
    } catch (err) {
      await fs.unlink(tmpPath).catch(() => undefined);
      throw err;
    }
    if (logOnSuccess) {
      this.logger.log(`Persisted store to ${this.filePath}`);
    }
  }

  private isPersistedState(v: unknown): v is PersistedState {
    if (v === null || typeof v !== 'object') return false;
    const o = v as Record<string, unknown>;
    return Array.isArray(o.slots) && Array.isArray(o.appointments);
  }

  private reviveSlot(raw: SlotEntity): SlotEntity {
    return {
      ...raw,
      time:
        raw.time instanceof Date
          ? raw.time
          : new Date(raw.time as string | number),
    };
  }

  private reviveAppointment(raw: AppointmentEntity): AppointmentEntity {
    return {
      ...raw,
      reservedAt:
        raw.reservedAt instanceof Date
          ? raw.reservedAt
          : new Date(raw.reservedAt as string | number),
    };
  }
}
