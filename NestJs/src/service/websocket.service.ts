import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from 'home-assistant-js-websocket';
import { setTimeout } from 'timers/promises';

export interface Servo {
  max: number;
  min: number;
  value: number;
  id: string;
}

@Injectable()
export class WebSocketService implements OnApplicationBootstrap {
  private connection: Connection;

  private pitch: Servo = {
    max: 70,
    min: 20,
    value: 0,
    id: 'number.pitch_control',
  };

  private yaw: Servo = {
    max: 70,
    min: -40,
    value: 0,
    id: 'number.yaw_control',
  };

  private switchIds = {
    relayOne: 'switch.relay_1',
    relayTwo: 'switch.relay_2',
  };

  constructor(
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

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
    const auth = createLongLivedTokenAuth(
      this.configService.get('HOME_ASSISTANT_URL'),
      this.configService.get('HOME_ASSISTANT_API'),
    );
    this.connection = await createConnection({ auth });
    this.subscribeHomeEntities();
    this.resetServos();
    console.log('HomeAssistant Service started');
  }

  subscribeHomeEntities() {
    subscribeEntities(this.connection, (ent) => {
      const autoModeState = ent['switch.auto_mode_active'].state;
      if (autoModeState === 'on') {
        this.eventEmitter.emit('autoModeActivated');
      } else if (autoModeState === 'off') {
        this.eventEmitter.emit('autoModeDeactivated');
      }
    });
  }

  async moveServoPitch(value: number) {
    const init = this.pitch.value;
    this.pitch.value += value;
    this.pitch.value = this.clamp(this.pitch);

    if (init !== this.pitch.value) {
      await this.callServiceSetNumber(this.pitch);
    }
  }

  async moveServoYaw(value: number) {
    const init = this.yaw.value;
    this.yaw.value += value;
    this.yaw.value = this.clamp(this.yaw);

    if (init !== this.yaw.value) {
      await this.callServiceSetNumber(this.yaw);
    }
  }

  async moveServos(yaw: number, pitch: number) {
    await this.moveServoYaw(yaw);
    await this.moveServoPitch(pitch);
    // wait for servos to move in place
    await setTimeout(50);
  }

  async callServiceSetNumber(target: Servo) {
    await callService(this.connection, 'number', 'set_value', {
      entity_id: target.id,
      value: target.value,
    });
  }

  async callServiceSwitchOn(switchId: string) {
    await callService(this.connection, 'switch', 'turn_on', {
      entity_id: switchId,
    });
  }

  async callServiceSwitchOff(switchId: string) {
    await callService(this.connection, 'switch', 'turn_off', {
      entity_id: switchId,
    });
  }

  async changeValveState(state: boolean) {
    if (state) {
      await this.callServiceSwitchOn(this.switchIds.relayTwo);
    } else {
      await this.callServiceSwitchOff(this.switchIds.relayTwo);
    }
  }

  async releaseWaterValve(durationMilliSecond: number) {
    await this.changeValveState(true);
    await setTimeout(durationMilliSecond);
    await this.changeValveState(false);
    await setTimeout(5000);
  }

  async resetServos() {
    this.yaw.value = 15;
    this.pitch.value = 50;
    await this.callServiceSetNumber(this.pitch);
    await this.callServiceSetNumber(this.yaw);
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
}
