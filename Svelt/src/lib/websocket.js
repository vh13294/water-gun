import {
    callService,
    createConnection,
    createLongLivedTokenAuth,
} from "home-assistant-js-websocket";

class WebSocket {
    constructor() {
        this.connection;
        this.pitch = {
            max: 70,
            min: 20,
            value: 0,
            id: 'number.pitch_control'
        }
        this.yaw = {
            max: 70,
            min: -30,
            value: 0,
            id: 'number.yaw_control'
        }
        this.connectHomeAssistant()
    }

    async connectHomeAssistant() {
        const auth = createLongLivedTokenAuth(
            "http://192.168.20.242:8123",
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjMzEyMjExYmFmNmQ0NGM5Yjg4MGFkOTQ1OGQ1MGM3OCIsImlhdCI6MTY2MTc2MzM1NSwiZXhwIjoxOTc3MTIzMzU1fQ.BDyweFlSs1SCFJLr7u5ySTvZKRTbkaguTNf9L7JWHjM"
        );
        this.connection = await createConnection({ auth });
        await this.resetServos()
    }

    /**
     * @param {number} [value]
     */
    async moveServoPitch(value) {
        const init = this.pitch.value
        this.pitch.value += value
        this.pitch.value = this.clamp(this.pitch)

        if (init !== this.pitch.value) {
            this.callServiceSetNumber(this.pitch)
        }
    }

    /**
     * @param {number} [value]
     */
    async moveServoYaw(value) {
        const init = this.yaw.value
        this.yaw.value += value
        this.yaw.value = this.clamp(this.yaw)

        if (init !== this.yaw.value) {
            this.callServiceSetNumber(this.yaw)
        }
    }

    /**
     * @param {object} target
     */
    async callServiceSetNumber(target) {
        await callService(this.connection, "number", "set_value", {
            entity_id: target.id,
            value: target.value,
        });
    }

    async resetServos() {
        this.yaw.value = 20
        this.pitch.value = 50
        this.callServiceSetNumber(this.pitch)
        this.callServiceSetNumber(this.yaw)
    }

    /**
     * @param {object} target
     */
    clamp(target) {
        if (target.value > target.max) {
            return target.max
        } else if (target.value < target.min) {
            return target.min
        } else {
            return target.value
        }
    };
}

const webSocket = new WebSocket();

export default webSocket