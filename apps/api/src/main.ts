import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const envFile = [
  resolve(process.cwd(), ".env"),
  resolve(process.cwd(), "..", "..", ".env"),
].find(existsSync);

if (envFile) {
  config({ path: envFile });
}

async function bootstrap() {
  const logger = new Logger("RapidLifelineAPI");
  const { AppModule } = await import("./app.module.js");
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("v1");
  app.enableCors();

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Rapid Lifeline API is running on http://localhost:${port}/v1`);
  logger.log(`Health endpoint: http://localhost:${port}/v1/health`);
}

bootstrap();
