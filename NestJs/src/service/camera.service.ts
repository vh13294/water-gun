import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Keypoint } from '@tensorflow-models/pose-detection';
import MjpegDecoder from 'mjpeg-decoder';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';

@Injectable()
export class CameraService implements OnModuleInit {
  private decoder: MjpegDecoder;
  private isProcessing = false;
  private isShooting = false;
  private isAutoMode = false;
  private centreImage = { x: 0, y: 0 };
  private servoRatio = { yaw: 0, pitch: 0 };

  constructor(
    private configService: ConfigService,
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async onModuleInit() {
    this.initMetaData();
    this.initStream();
    console.log('Camera Service started');
  }

  private async initStream() {
    const url = this.configService.get('STREAM_URL');

    this.decoder = new MjpegDecoder(url, { interval: 50, timeout: 1000 });
    this.decoder.on('frame', (frame) => {
      this.onFrameReady(frame);
    });
  }

  private initMetaData() {
    this.centreImage.x = Number(this.configService.get('IMG_WIDTH')) / 2;
    this.centreImage.y = Number(this.configService.get('IMG_HEIGHT')) / 2;

    this.servoRatio.yaw = Number(this.configService.get('SERVO_YAW_RATIO'));
    this.servoRatio.pitch = Number(this.configService.get('SERVO_PITCH_RATIO'));
  }

  private async onFrameReady(frame: Buffer) {
    if (!this.isProcessing && this.isAutoMode) {
      this.isProcessing = true;
      try {
        await this.frameAction(frame);
      } catch (error) {
        console.log(error);
      } finally {
        this.isProcessing = false;
      }
      console.timeEnd('frame');
      console.time('frame');
    }
  }

  private async frameAction(frame: Buffer) {
    const keypoints = await this.tensorFlowService.getPose(frame);
    if (keypoints) {
      const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
        'nose',
        keypoints,
      );
      await this.moveToTarget(nosePoint);
      // warning no await, better
      // this.shootTarget();
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

  @OnEvent('autoModeActivated')
  startDecoder() {
    this.isAutoMode = true;
    this.decoder.start();
  }

  @OnEvent('autoModeDeactivated')
  stopDecoder() {
    this.isAutoMode = false;
    this.decoder.stop();
  }
}
