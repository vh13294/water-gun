import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { CameraService } from './camera.service';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';
import { setTimeout } from 'timers/promises';

@Injectable()
export class TaskService {
  private static isAutoMode = false;
  private static isProcessing = false;

  constructor(
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
    private readonly cameraService: CameraService,
  ) {}

  @Interval(10000)
  async handleInterval() {
    console.log('Called every 10 seconds');
    if (TaskService.isAutoMode && !TaskService.isProcessing) {
      TaskService.isProcessing = true;
      try {
        this.detectPoseAndShoot();
      } catch (error) {
        console.log(error);
      } finally {
        TaskService.isProcessing = false;
      }
    }
  }

  private async detectPoseAndShoot() {
    const pose = await this.tensorFlowService.getPose();
    const nosePoint = pose[0].keypoints.filter(
      (keyPoint) => keyPoint.name === 'nose',
    )[0];
    console.log(nosePoint);

    const servos = this.cameraService.getServoValuesFromImagePoint(
      nosePoint.x,
      nosePoint.y,
    );
    this.webSocketService.moveServoPitch(servos.pitch);
    this.webSocketService.moveServoYaw(servos.yaw);

    // wait for servos to move to position
    await setTimeout(500);

    // open water valve,

    // open valve for 1.5s
    await setTimeout(1500);

    // close water valve

    this.webSocketService.resetServos();
  }

  setAutoMode(bool: boolean) {
    TaskService.isAutoMode = bool;
  }
}
