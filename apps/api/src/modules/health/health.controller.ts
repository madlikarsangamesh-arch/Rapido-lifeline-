import { Controller, Get } from '@nestjs/common';
import { Public } from '../../common/guards/auth.guard.js';

@Controller('health')
export class HealthController {
  @Public()
  @Get()
  checkHealth() {
    return {
      status: 'ok',
      service: 'rapid-lifeline-api',
      timestamp: new Date().toISOString(),
      prototype: process.env.PROTOTYPE_LABEL === 'true',
    };
  }
}

