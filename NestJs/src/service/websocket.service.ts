import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from 'home-assistant-js-websocket';
import { setTimeout } from 'timers/promises';
import { TaskService } from './task.service';

export interface Servo {
  max: number;
  min: number;
  id: string;
}

@Injectable()
export class WebSocketService implements OnModuleInit {
  static connection: Connection;
  static pitch: Servo = {
    max: 70,
    min: 35,
    id: 'number.pitch_control',
  };
  static yaw: Servo = {
    max: 70,
    min: -40,
    id: 'number.yaw_control',
  };

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      const auth = createLongLivedTokenAuth(
        this.configService.get('HOME_ASSISTANT_URL'),
        this.configService.get('HOME_ASSISTANT_API'),
      );
      WebSocketService.connection = await createConnection({ auth });
      console.log('HomeAssistant Service started');
      await this.resetServos();
      this.subscribeEntities();
    } catch (error) {
      console.log(error);
    }
  }

  subscribeEntities() {
    subscribeEntities(WebSocketService.connection, (ent) => {
      const autoModeState = ent['switch.auto_mode_active'].state;
      if (autoModeState === 'on') {
        TaskService.isAutoMode = true;
      } else if (autoModeState === 'off') {
        TaskService.isAutoMode = false;
      }
    });
  }

  async moveServoPitch(value: number) {
    const pitch = this.clamp(WebSocketService.pitch, value);
    await this.callServiceSetNumber(WebSocketService.pitch, pitch);
  }

  async moveServoYaw(value: number) {
    const yaw = this.clamp(WebSocketService.yaw, value);
    await this.callServiceSetNumber(WebSocketService.yaw, yaw);
  }

  async moveServos(yaw: number, pitch: number) {
    await this.moveServoYaw(yaw);
    await this.moveServoPitch(pitch);
    // wait for servos to move in place
    await setTimeout(50);
  }

  async callServiceSetNumber(target: Servo, value: number) {
    await callService(WebSocketService.connection, 'number', 'set_value', {
      entity_id: target.id,
      value: value,
    });
  }

  async releaseWaterValve(durationMilliSecond: number) {
    // open water valve,
    // open valve for 1.5s
    await setTimeout(durationMilliSecond);
    // close water valve
  }

  async resetServos() {
    await this.moveServos(15, 50);
  }

  private clamp(target: Servo, value: number) {
    if (value > target.max) {
      return target.max;
    } else if (value < target.min) {
      return target.min;
    } else {
      return value;
    }
  }
}
