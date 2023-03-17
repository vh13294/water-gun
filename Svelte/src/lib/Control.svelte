<script lang="ts">
  import websocket from "./websocket";
  import { autoTrackingState, autoShootState } from "./websocket";

  let showAdvancedSettings = false;
</script>

<div class="control">
  <h3>Auto Tracking State: {$autoTrackingState}</h3>
  <h3>Auto Shoot State: {$autoShootState}</h3>

  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
    <button
      style="flex: 0 0 80%; height: 3rem;"
      on:click={() => websocket.releaseValve(500)}
    >
      Shoot
    </button>

    <button on:click={() => websocket.setAutoTracking(true)}>
      Auto Tracking On
    </button>

    <button on:click={() => websocket.setAutoTracking(false)}>
      Auto Tracking Off
    </button>

    <button on:click={() => websocket.setAutoShoot(true)}>
      Auto Tracking On
    </button>

    <button on:click={() => websocket.setAutoShoot(false)}>
      Auto Tracking Off
    </button>

    <!-- <button on:click={() => websocket.printServoPos()}>Print servo pos</button> -->
  </div>

  <div style="background-color: rgba(170, 128, 61, 0.073);">
    <button on:click={() => (showAdvancedSettings = !showAdvancedSettings)}>
      Advanced</button
    >

    {#if showAdvancedSettings}
      <div
        style="display: flex; flex-wrap: wrap; justify-content: space-around;"
      >
        <button on:click={() => websocket.resetServos()}> Reset Servos </button>

        <button on:click={() => websocket.balancePumpAndValve()}>
          Balance Pump & Valve</button
        >

        <button on:click={() => websocket.changeValveState(false)}>
          off valve
        </button>

        <button on:click={() => websocket.changeValveState(true)}>
          on valve
        </button>

        <button on:click={() => websocket.changePumpState(false)}>
          off pump
        </button>

        <button on:click={() => websocket.changePumpState(true)}>
          on pump
        </button>

        <button on:click={() => websocket.turnOffAllRelays()}>
          off All relays
        </button>
      </div>
    {/if}
  </div>
</div>

<style>
  .control {
    width: 400px;
    height: 500px;
    background-color: rgba(250, 236, 215, 0.073);
    position: absolute;
    top: 40%;
    right: 2%;
    transform: translate(-2%, -40%);
    z-index: 1;
    opacity: 0.6;
    text-align: center;
  }

  button {
    font-size: 1.5rem;
    margin: 10px;
  }

  @media only screen and (max-width: 1200px) {
    .control {
      transform: scale(0.7);
      transform-origin: top right;
      top: 5%;
      width: 200px;
    }
  }
</style>
