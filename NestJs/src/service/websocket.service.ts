import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';
import { setTimeout } from 'timers/promises';

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
    min: 20,
    id: 'number.pitch_control',
  };
  static yaw: Servo = {
    max: 70,
    min: -30,
    id: 'number.yaw_control',
  };

  async onModuleInit() {
    const auth = createLongLivedTokenAuth(
      'http://192.168.20.242:8123',
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjMzEyMjExYmFmNmQ0NGM5Yjg4MGFkOTQ1OGQ1MGM3OCIsImlhdCI6MTY2MTc2MzM1NSwiZXhwIjoxOTc3MTIzMzU1fQ.BDyweFlSs1SCFJLr7u5ySTvZKRTbkaguTNf9L7JWHjM',
    );
    WebSocketService.connection = await createConnection({ auth });
    console.log('HomeAssistant Service started');
    await this.resetServos();
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
    await setTimeout(300);
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
    await this.moveServos(20, 50);
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
