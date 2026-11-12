import 'dotenv/config';
import { Logger } from '@nestjs/common';

async function runWorker() {
  const logger = new Logger('RapidLifelineWorker');
  logger.log('Rapid Lifeline Worker initialized (BullMQ runner standby)');

  process.on('SIGTERM', () => {
    logger.log('Worker received SIGTERM. Shutting down gracefully.');
    process.exit(0);
  });
}

runWorker();

