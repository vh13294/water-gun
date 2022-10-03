import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { setTimeout } from 'timers/promises';
import { WebSocketBase } from 'share';

export interface Servo {
  max: number;
  min: number;
  value: number;
  id: string;
}

@Injectable()
export class WebSocketService
  extends WebSocketBase
  implements OnApplicationBootstrap
{
  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    super();
  }

  async onApplicationBootstrap() {
    try {
      await this.init();
    } catch (error) {
      console.error(`Home assistant error number: ${error}`);
      // retry every 30s
      await setTimeout(30000);
      this.onApplicationBootstrap();
    }
  }

  async init() {
    await this.connectHA(
      this.configService.get('HOME_ASSISTANT_URL'),
      this.configService.get('HOME_ASSISTANT_API'),
      () => {
        this.eventEmitter.emit('autoModeActivated');
      },
      () => {
        this.eventEmitter.emit('autoModeDeactivated');
      },
    );
  }

  async moveServos(yaw: number, pitch: number) {
    await this.moveServoYaw(yaw);
    await this.moveServoPitch(pitch);
    // wait for servos to move in place
    await setTimeout(50);
  }

  async releaseWaterValve(durationMilliSecond: number) {
    await this.changeValveState(true);
    await setTimeout(durationMilliSecond);
    await this.changeValveState(false);
    await setTimeout(5000);
  }
}
