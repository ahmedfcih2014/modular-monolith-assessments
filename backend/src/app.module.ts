import { Module } from '@nestjs/common';
import { HealthController } from './modules/health/api/health.controller';

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
