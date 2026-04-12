import { Global, Module } from '@nestjs/common';
import { DataStore } from 'src/shared/data-store';

@Global()
@Module({
  providers: [DataStore],
  exports: [DataStore],
})
export class SharedModule {}
