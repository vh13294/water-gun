"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketBase = void 0;
const home_assistant_js_websocket_1 = require("home-assistant-js-websocket");
class WebSocketBase {
    connection;
    pitch = {
        max: 70,
        min: 20,
        value: 0,
        id: "number.pitch_control",
    };
    yaw = {
        max: 70,
        min: -40,
        value: 0,
        id: "number.yaw_control",
    };
    switchIds = {
        relayOne: "switch.relay_1",
        relayTwo: "switch.relay_2",
    };
    async connectHA(url, api) {
        const auth = (0, home_assistant_js_websocket_1.createLongLivedTokenAuth)(url, api);
        this.connection = await (0, home_assistant_js_websocket_1.createConnection)({ auth });
        console.log("HomeAssistant Service started");
        await this.resetServos();
    }
    async moveServoPitch(value) {
        const init = this.pitch.value;
        this.pitch.value += value;
        this.pitch.value = this.clamp(this.pitch);
        if (init !== this.pitch.value) {
            await this.callServiceSetNumber(this.pitch);
        }
    }
    async moveServoYaw(value) {
        const init = this.yaw.value;
        this.yaw.value += value;
        this.yaw.value = this.clamp(this.yaw);
        if (init !== this.yaw.value) {
            await this.callServiceSetNumber(this.yaw);
        }
    }
    async releaseValve(durationMilliSecond) {
        await this.changeValveState(true);
        setTimeout(async () => {
            await this.changeValveState(false);
        }, durationMilliSecond);
    }
    async releasePump(durationMilliSecond) {
        await this.changePumpState(true);
        setTimeout(async () => {
            await this.changePumpState(false);
        }, durationMilliSecond);
    }
    async changePumpState(state) {
        if (state) {
            await this.callServiceSwitchOn(this.switchIds.relayOne);
        }
        else {
            await this.callServiceSwitchOff(this.switchIds.relayOne);
        }
    }
    async changeValveState(state) {
        if (state) {
            await this.callServiceSwitchOn(this.switchIds.relayTwo);
        }
        else {
            await this.callServiceSwitchOff(this.switchIds.relayTwo);
        }
    }
    async turnOffAllRelays() {
        await this.changePumpState(false);
        await this.changeValveState(false);
    }
    async callServiceSetNumber(target) {
        await (0, home_assistant_js_websocket_1.callService)(this.connection, "number", "set_value", {
            entity_id: target.id,
            value: target.value,
        });
    }
    async callServiceSwitchOn(switchId) {
        await (0, home_assistant_js_websocket_1.callService)(this.connection, "switch", "turn_on", {
            entity_id: switchId,
        });
    }
    async callServiceSwitchOff(switchId) {
        await (0, home_assistant_js_websocket_1.callService)(this.connection, "switch", "turn_off", {
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
    clamp(target) {
        if (target.value > target.max) {
            return target.max;
        }
        else if (target.value < target.min) {
            return target.min;
        }
        else {
            return target.value;
        }
    }
}
exports.WebSocketBase = WebSocketBase;
