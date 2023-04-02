import { writable } from "svelte/store";
import { WebSocketBase } from "share";

export const autoTrackingState = writable(false);
export const autoShootState = writable(false);

class WebSocket extends WebSocketBase {
  constructor() {
    super();

    const url =
      import.meta.env.VITE_BASE_URL + import.meta.env.VITE_HOME_ASSISTANT_URL;
    const apiKey = import.meta.env.VITE_HOME_ASSISTANT_API;
    this.connectHA(
      url,
      apiKey,
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
