import { BadRequestException, Controller, Get } from '@nestjs/common';

@Controller({
  path: 'health',
  version: '1',
})
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: 'ok',
    };
  }

  @Get('error')
  getError() {
    throw new BadRequestException('This is a test error');
  }
}
