import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { Keypoint } from '@tensorflow-models/pose-detection';
import fetch from 'node-fetch';
import { TensorFlowService } from './tensorflow.service';
import { WebSocketService } from './websocket.service';

const SOI = Buffer.from([0xff, 0xd8]);
const EOI = Buffer.from([0xff, 0xd9]);
const EOF = -1;

@Injectable()
export class StreamService implements OnModuleInit {
  private stream: NodeJS.ReadableStream;

  imgData = Buffer.alloc(0);
  imgStart = -1;
  imgEnd = -1;

  constructor(
    private configService: ConfigService,
    private readonly tensorFlowService: TensorFlowService,
    private readonly webSocketService: WebSocketService,
  ) {}

  async onModuleInit() {
    this.initStream();
    console.log('Stream Service started');
  }

  async initStream() {
    const url = this.configService.get('STREAM_URL');
    const response = await fetch(url);
    this.stream = response.body;
    this.stream.pause();
    this.stream.on('data', (data) => {
      this.buildFrame(data);
    });
  }

  // @OnEvent('autoModeActivated')
  async streamStart() {
    this.stream.resume();
  }

  // @OnEvent('autoModeDeactivated')
  async streamStop() {
    this.stream.pause();
  }

  private buildFrame(chunk: Buffer) {
    this.imgData = Buffer.concat([this.imgData, chunk]);

    if (this.imgStart === EOF) {
      this.imgStart = this.imgData.indexOf(SOI);
    }

    if (this.imgStart >= 0) {
      if (this.imgEnd === EOF) {
        this.imgEnd = this.imgData.indexOf(EOI, this.imgStart + SOI.length);
      }
      if (this.imgEnd >= this.imgStart) {
        // a frame is found.
        const frame = this.imgData.subarray(
          this.imgStart,
          this.imgEnd + EOI.length,
        );
        // this.frameAction(frame);
        this.imgData = frame;
        this.imgData = this.imgData.subarray(this.imgEnd + EOI.length);
        console.log(this.imgData);
        // this.imgData = Buffer.alloc(0);
        this.imgStart = EOF;
        this.imgEnd = EOF;
      }
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
    }
  }

  private async moveToTarget(keypoint: Keypoint) {
    const centreX = Number(this.configService.get('IMG_WIDTH')) / 2;
    const centreY = Number(this.configService.get('IMG_HEIGHT')) / 2;

    const diffX = centreX - keypoint.x;
    const diffY = centreY - keypoint.y;

    const moveX = Number(this.configService.get('SERVO_YAW_RATIO')) * diffX;
    const moveY = Number(this.configService.get('SERVO_PITCH_RATIO')) * diffY;

    console.log(
      `key: ${keypoint.x}, ${keypoint.y}, diff: ${diffX}, ${diffY}, move: ${moveX}, ${moveY}`,
    );
    await this.webSocketService.moveServos(moveX, moveY);
  }
}
