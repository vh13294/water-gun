import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TensorFlowService } from './service/tensorflow.service';
import { WebSocketService } from './service/websocket.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [TensorFlowService, WebSocketService],
})
export class AppModule {}
