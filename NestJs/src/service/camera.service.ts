import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Keypoint } from '@tensorflow-models/pose-detection';
import { TaskService } from './task.service';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';

@Injectable()
export class CameraService implements OnModuleInit {
  private isProcessing = false;
  private isShooting = false;
  private centreImage = { x: 0, y: 0 };
  private servoRatio = { yaw: 0, pitch: 0 };

  constructor(
    private configService: ConfigService,
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
    private readonly taskService: TaskService,
  ) {}

  async onModuleInit() {
    this.initMetaData();
    console.log('Camera Service started');
  }

  private initMetaData() {
    this.centreImage.x = Number(this.configService.get('IMG_WIDTH')) / 2;
    this.centreImage.y = Number(this.configService.get('IMG_HEIGHT')) / 2;

    this.servoRatio.yaw = Number(this.configService.get('SERVO_YAW_RATIO'));
    this.servoRatio.pitch = Number(this.configService.get('SERVO_PITCH_RATIO'));
  }

  private async frameAction(frame: Buffer) {
    const pose = await this.tensorFlowService.getPose(frame);
    if (pose && pose.keypoints && pose.score > 0.4) {
      const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
        'nose',
        pose.keypoints,
      );
      await this.moveToTarget(nosePoint);
      // warning no await, better
      // this.shootTarget();
    }
  }

  private async frameActionTest(frame: Buffer) {
    const pose = await this.tensorFlowService.getPose(frame);
    if (pose && pose.keypoints && pose.score > 0.1) {
      await this.taskService.canvasDraw(
        pose.keypoints,
        frame,
        pose.score.toString(),
      );
    }
  }

  private async moveToTarget(keypoint: Keypoint) {
    const diffX = this.centreImage.x - keypoint.x;
    const diffY = this.centreImage.y - keypoint.y;

    const moveX = this.servoRatio.yaw * diffX;
    const moveY = this.servoRatio.pitch * diffY;

    // console.log(
    //   `key: ${keypoint.x}, ${keypoint.y}, diff: ${diffX}, ${diffY}, move: ${moveX}, ${moveY}`,
    // );
    console.log(keypoint.score);
    await this.webSocketService.moveServos(moveX, moveY);
  }

  private async shootTarget() {
    if (!this.isShooting) {
      this.isShooting = true;
      try {
        await this.webSocketService.releaseWaterValve(500);
      } catch (error) {
        console.log(error);
      } finally {
        this.isShooting = false;
      }
    }
  }

  @OnEvent('onFrameReady')
  async onFrameReady(frame: Buffer) {
    if (!this.isProcessing) {
      this.isProcessing = true;
      try {
        await this.frameAction(frame);
        // await this.frameActionTest(frame);
      } catch (error) {
        console.log(error);
      } finally {
        this.isProcessing = false;
      }
      console.timeEnd('frame');
      console.time('frame');
    }
  }
}
