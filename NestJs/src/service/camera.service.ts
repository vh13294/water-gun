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

  constructor(
    private configService: ConfigService,
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async onModuleInit() {
    this.initStream();
    console.log('Camera Service started');
  }

  private async initStream() {
    const url = this.configService.get('STREAM_URL');

    this.decoder = new MjpegDecoder(url, { interval: 50, timeout: 1000 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.decoder.on('frame', async (frame, seq) => {
      if (!this.isProcessing) {
        this.isProcessing = true;
        try {
          await this.frameAction(frame);
        } catch (error) {
          console.log(error);
          this.webSocketService.setAutoMode(false);
        } finally {
          this.isProcessing = false;
        }
        console.timeEnd('frame');
        console.time('frame');
      }
    });
  }

  private async frameAction(frame: Buffer) {
    const keypoints = await this.tensorFlowService.getPose(frame);
    if (keypoints) {
      const nosePoint = this.tensorFlowService.getSpecificKeyPoint(
        'nose',
        keypoints,
      );
      await this.moveToTarget(nosePoint);
    }
  }

  async moveToTarget(keypoint: Keypoint) {
    const centreX = Number(this.configService.get('IMG_WIDTH')) / 2;
    const centreY = Number(this.configService.get('IMG_HEIGHT')) / 2;

    const diffX = centreX - keypoint.x;
    const diffY = centreY - keypoint.y;

    const moveX = Number(this.configService.get('SERVO_YAW_RATIO')) * diffX;
    const moveY = Number(this.configService.get('SERVO_PITCH_RATIO')) * diffY;

    // console.log(
    //   `key: ${keypoint.x}, ${keypoint.y}, diff: ${diffX}, ${diffY}, move: ${moveX}, ${moveY}`,
    // );
    console.log(keypoint.score);
    await this.webSocketService.moveServos(moveX, moveY);
  }

  @OnEvent('autoModeActivated')
  startDecoder() {
    this.decoder.start();
  }

  @OnEvent('autoModeDeactivated')
  stopDecoder() {
    this.decoder.stop();
  }
}
