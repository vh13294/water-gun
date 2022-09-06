import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
} from 'home-assistant-js-websocket';

export interface Servo {
  max: number;
  min: number;
  value: number;
  id: string;
}

@Injectable()
export class WebSocketService implements OnModuleInit {
  static connection: Connection;
  static pitch: Servo = {
    max: 70,
    min: 20,
    value: 0,
    id: 'number.pitch_control',
  };
  static yaw: Servo = {
    max: 70,
    min: -30,
    value: 0,
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
    const init = WebSocketService.pitch.value;
    WebSocketService.pitch.value += value;
    WebSocketService.pitch.value = this.clamp(WebSocketService.pitch);

    if (init !== WebSocketService.pitch.value) {
      this.callServiceSetNumber(WebSocketService.pitch);
    }
  }

  async moveServoYaw(value: number) {
    const init = WebSocketService.yaw.value;
    WebSocketService.yaw.value += value;
    WebSocketService.yaw.value = this.clamp(WebSocketService.yaw);

    if (init !== WebSocketService.yaw.value) {
      this.callServiceSetNumber(WebSocketService.yaw);
    }
  }

  async callServiceSetNumber(target: Servo) {
    await callService(WebSocketService.connection, 'number', 'set_value', {
      entity_id: target.id,
      value: target.value,
    });
  }

  async randomServos() {
    const randomPitch = this.randomInteger(
      WebSocketService.pitch.min,
      WebSocketService.pitch.max,
    );
    const randomYaw = this.randomInteger(
      WebSocketService.yaw.min,
      WebSocketService.yaw.max,
    );
    await this.moveServoPitch(randomPitch);
    await this.moveServoYaw(randomYaw);
  }

  async resetServos() {
    WebSocketService.yaw.value = 20;
    WebSocketService.pitch.value = 50;
    this.callServiceSetNumber(WebSocketService.pitch);
    this.callServiceSetNumber(WebSocketService.yaw);
  }

  private clamp(target: Servo) {
    if (target.value > target.max) {
      return target.max;
    } else if (target.value < target.min) {
      return target.min;
    } else {
      return target.value;
    }
  }

  private randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
