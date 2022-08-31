import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';

@Injectable()
export class TaskService {
  private isAutoMode = false;
  private isProcessing = false;

  constructor(
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
  ) {}

  @Interval(10000)
  async handleInterval() {
    console.log('Called every 10 seconds');
    if (this.isAutoMode && !this.isProcessing) {
      this.isProcessing = true;
      const pose = await this.tensorFlowService.getPose();
      await this.webSocketService.randomServos();
      console.log(Object.values(pose[0].keypoints)[0]);
      this.isProcessing = false;
    }
  }

  setAutoMode(bool: boolean) {
    this.isAutoMode = bool;
  }
}
