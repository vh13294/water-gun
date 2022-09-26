import {
  callService,
  Connection,
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from "home-assistant-js-websocket";
import { writable } from "svelte/store";

interface Servo {
  max: number;
  min: number;
  value: number;
  id: string;
}

export const autoModeState = writable(false);

class WebSocket {
  private connection: Connection;
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
    autoMode: "switch.auto_mode_active",
  };

  constructor() {
    this.connectHA();
  }

  async connectHA() {
    const auth = createLongLivedTokenAuth(
      import.meta.env.VITE_HOME_ASSISTANT_URL,
      import.meta.env.VITE_HOME_ASSISTANT_API
    );
    this.connection = await createConnection({ auth });
    console.log("HA Init");
    await this.resetServos();
    await this.subscribeAutoMode();
  }

  async moveServoPitch(value: number) {
    const init = this.pitch.value;
    this.pitch.value += value;
    this.pitch.value = this.clamp(this.pitch);

    if (init !== this.pitch.value) {
      this.callServiceSetNumber(this.pitch);
    }
  }

  async moveServoYaw(value: number) {
    const init = this.yaw.value;
    this.yaw.value += value;
    this.yaw.value = this.clamp(this.yaw);

    if (init !== this.yaw.value) {
      this.callServiceSetNumber(this.yaw);
    }
  }

  async subscribeAutoMode() {
    subscribeEntities(this.connection, (ent) => {
      const newState = ent["switch.auto_mode_active"].state;
      if (newState === "on") {
        autoModeState.set(true);
      } else if (newState === "off") {
        autoModeState.set(false);
      }
    });
  }

  async setAutoMode(state: boolean) {
    if (state) {
      this.callServiceSwitchOn(this.switchIds.autoMode);
    } else {
      this.callServiceSwitchOff(this.switchIds.autoMode);
    }
  }

  async releaseValve(durationMilliSecond: number) {
    this.changeValveState(true);
    setTimeout(() => {
      this.changeValveState(false);
    }, durationMilliSecond);
  }

  async changeValveState(state: boolean) {
    if (state) {
      this.callServiceSwitchOn(this.switchIds.relayOne);
    } else {
      this.callServiceSwitchOff(this.switchIds.relayOne);
    }
  }

  async changePumpState(state: boolean) {
    if (state) {
      this.callServiceSwitchOn(this.switchIds.relayTwo);
    } else {
      this.callServiceSwitchOff(this.switchIds.relayTwo);
    }
  }

  async turnOffAllRelays() {
    this.changePumpState(false);
    this.changeValveState(false);
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

  async resetServos() {
    this.yaw.value = 15;
    this.pitch.value = 50;
    this.callServiceSetNumber(this.pitch);
    this.callServiceSetNumber(this.yaw);
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

const webSocket = new WebSocket();

export default webSocket;
