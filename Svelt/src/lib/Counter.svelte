<script>
  import { onMount } from "svelte";
  import websocket from "./websocket";

  let count = 0;

  onMount(() => {});
  const increment = () => {
    websocket.moveServoPitch();
    websocket.moveServoYaw();
    count += 1;
  };
</script>

<button on:click={increment}>
  count is {count}
</button>
