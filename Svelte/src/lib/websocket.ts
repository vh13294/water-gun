import { WebSocketBase } from "share";

class WebSocket extends WebSocketBase {
  constructor() {
    super();

    const url =
      import.meta.env.VITE_BASE_URL + import.meta.env.VITE_HOME_ASSISTANT_URL;

    const apiKey = import.meta.env.VITE_HOME_ASSISTANT_API;

    this.connectHA(url, apiKey);
  }
}

const webSocket = new WebSocket();

export default webSocket;
