import { writable } from "svelte/store";
import { WebSocketBase } from "share";

export const autoTrackingState = writable(false);
export const autoShootState = writable(false);

class WebSocket extends WebSocketBase {
  constructor() {
    super();

    this.connectHA(
      import.meta.env.VITE_HOME_ASSISTANT_URL,
      import.meta.env.VITE_HOME_ASSISTANT_API,
      (state: boolean) => {
        if (state) {
          autoTrackingState.set(true);
        } else {
          autoTrackingState.set(false);
        }
      },
      (state: boolean) => {
        if (state) {
          autoShootState.set(true);
        } else {
          autoShootState.set(false);
        }
      }
    );
  }
}

const webSocket = new WebSocket();

export default webSocket;
