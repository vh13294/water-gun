import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TensorFlowService } from './service/tensorflow.service';
import { WebSocketService } from './service/websocket.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './service/task.service';

@Module({
  imports: [HttpModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [TensorFlowService, WebSocketService, TaskService],
})
export class AppModule {}
