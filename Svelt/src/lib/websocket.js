import {
    callService,
    createConnection,
    createLongLivedTokenAuth,
} from "home-assistant-js-websocket";

class Websocket {
    constructor() {
        this.connection;
        this.connectHomeAssistant()
    }

    async connectHomeAssistant() {
        const auth = createLongLivedTokenAuth(
            "http://192.168.20.242:8123",
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjMzEyMjExYmFmNmQ0NGM5Yjg4MGFkOTQ1OGQ1MGM3OCIsImlhdCI6MTY2MTc2MzM1NSwiZXhwIjoxOTc3MTIzMzU1fQ.BDyweFlSs1SCFJLr7u5ySTvZKRTbkaguTNf9L7JWHjM"
        );
        this.connection = await createConnection({ auth });
    }

    async moveServoPitch() {
        await callService(this.connection, "number", "set_value", {
            entity_id: "number.pitch_control",
            value: 70,
        });
    }

    async moveServoYaw() {
        await callService(this.connection, "number", "set_value", {
            entity_id: "number.yaw_control",
            value: 70,
        });
    }
}

const websocket = new Websocket();

export default websocket