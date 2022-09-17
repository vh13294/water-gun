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
    min: -30,
    value: 0,
    id: "number.yaw_control",
  };

  private switches = {
    relayOneId: "switch.relay_1",
    relayTwoId: "switch.relay_2",
  };

  constructor() {
    this.connectHA();
  }

  async connectHA() {
    const auth = createLongLivedTokenAuth(
      "http://192.168.20.242:8123",
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjMzEyMjExYmFmNmQ0NGM5Yjg4MGFkOTQ1OGQ1MGM3OCIsImlhdCI6MTY2MTc2MzM1NSwiZXhwIjoxOTc3MTIzMzU1fQ.BDyweFlSs1SCFJLr7u5ySTvZKRTbkaguTNf9L7JWHjM"
    );
    this.connection = await createConnection({ auth });
    console.log("HA Init");
    await this.resetServos();
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

  async releaseValve(durationMilliSecond: number) {
    this.changeValveState(true);
    setTimeout(() => {
      this.changeValveState(false);
    }, durationMilliSecond);
  }

  async changeValveState(state: boolean) {
    if (state) {
      this.callServiceSwitchOn(this.switches.relayOneId);
    } else {
      this.callServiceSwitchOff(this.switches.relayOneId);
    }
  }

  async changePumpState(state: boolean) {
    if (state) {
      this.callServiceSwitchOn(this.switches.relayTwoId);
    } else {
      this.callServiceSwitchOff(this.switches.relayTwoId);
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
    this.yaw.value = 20;
    this.pitch.value = 50;
    this.callServiceSetNumber(this.pitch);
    this.callServiceSetNumber(this.yaw);
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
