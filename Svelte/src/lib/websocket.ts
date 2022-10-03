import { writable } from "svelte/store";
import { WebSocketBase } from "../../../Share";

export const autoModeState = writable(false);

class WebSocket extends WebSocketBase {
  constructor() {
    super();

    this.connectHA(
      import.meta.env.VITE_HOME_ASSISTANT_URL,
      import.meta.env.VITE_HOME_ASSISTANT_API,
      () => {
        autoModeState.set(true);
      },
      () => {
        autoModeState.set(false);
      }
    );
  }
}

const webSocket = new WebSocket();

export default webSocket;
