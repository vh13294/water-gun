import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TensorFlowService } from './service/tensorflow.service';
import { WebSocketService } from './service/websocket.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './service/task.service';
import { ConfigModule } from '@nestjs/config';
import { CameraService } from './service/camera.service';
import { HttpModule } from '@nestjs/axios';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { StreamService } from './service/stream.service';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [
    TensorFlowService,
    WebSocketService,
    TaskService,
    CameraService,
    StreamService,
  ],
})
export class AppModule {}
