import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TensorFlowService } from './tensorflow/tensorflow.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, TensorFlowService],
})
export class AppModule {}
