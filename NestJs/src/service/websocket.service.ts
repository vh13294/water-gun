import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  constructor(private configService: ConfigService) {
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
    const haUrl =
      this.configService.get('BASE_URL') +
      this.configService.get('HOME_ASSISTANT_URL');
    const apiKey = this.configService.get('HOME_ASSISTANT_API');

    await this.connectHA(haUrl, apiKey);
  }

  async moveServos(yaw: number, pitch: number) {
    await this.moveServoYaw(yaw);
    await this.moveServoPitch(pitch);
    // wait for servos to move in place
    await setTimeout(50);
  }

  async shootViaValve(durationMilliSecond: number) {
    await this.changeValveState(true);
    await setTimeout(durationMilliSecond);
    await this.changeValveState(false);
    await setTimeout(5000);
  }

  async shootViaPump(durationMilliSecond: number) {
    await this.changeValveState(true);
    await setTimeout(durationMilliSecond);
    await this.changeValveState(false);
    await setTimeout(5000);
  }
}
