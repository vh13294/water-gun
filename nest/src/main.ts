import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  Object.assign(global, { WebSocket: require('ws') });
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
