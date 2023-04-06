import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
} from "home-assistant-js-websocket";

interface Servo {
  max: number;
  min: number;
  value: number;
  id: string;
}

export class WebSocketBase {
  private connection!: Connection;

  private pitch: Servo = {
    max: 70,
    min: 20,
    value: 0,
    id: "number.pitch_control",
  };

  private yaw: Servo = {
    max: 70,
    min: -40,
    value: 0,
    id: "number.yaw_control",
  };

  private switchIds = {
    relayOne: "switch.relay_1",
    relayTwo: "switch.relay_2",
  };

  async connectHA(url: string, api: string) {
    const auth = createLongLivedTokenAuth(url, api);
    this.connection = await createConnection({ auth });
    console.log("HomeAssistant Service started");
    await this.resetServos();
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

  async releaseValve(durationMilliSecond: number) {
    await this.changeValveState(true);
    setTimeout(async () => {
      await this.changeValveState(false);
    }, durationMilliSecond);
  }

  async changePumpState(state: boolean) {
    if (state) {
      await this.callServiceSwitchOn(this.switchIds.relayOne);
    } else {
      await this.callServiceSwitchOff(this.switchIds.relayOne);
    }
  }

  async changeValveState(state: boolean) {
    if (state) {
      await this.callServiceSwitchOn(this.switchIds.relayTwo);
    } else {
      await this.callServiceSwitchOff(this.switchIds.relayTwo);
    }
  }

  async turnOffAllRelays() {
    await this.changePumpState(false);
    await this.changeValveState(false);
  }

  async callServiceSetNumber(target: Servo) {
    await callService(this.connection, "number", "set_value", {
      entity_id: target.id,
      value: target.value,
    });
  }

  async callServiceSwitchOn(switchId: string) {
    await callService(this.connection, "switch", "turn_on", {
      entity_id: switchId,
    });
  }

  async callServiceSwitchOff(switchId: string) {
    await callService(this.connection, "switch", "turn_off", {
      entity_id: switchId,
    });
  }

  async balancePumpAndValve() {
    await this.changeValveState(true);
    await this.changePumpState(true);
    setTimeout(async () => {
      await this.changeValveState(false);
    }, 3000);
  }

  async resetServos() {
    this.yaw.value = 15;
    this.pitch.value = 50;
    await this.callServiceSetNumber(this.pitch);
    await this.callServiceSetNumber(this.yaw);
  }

  printServoPos() {
    console.log(`yaw: ${this.yaw.value}, pitch: ${this.pitch.value}`);
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
