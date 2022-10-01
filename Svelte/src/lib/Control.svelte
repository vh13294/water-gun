<script lang="ts">
  import websocket from "./websocket";
  import { autoModeState } from "./websocket";
</script>

<div class="control">
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
    <button on:click={() => websocket.resetServos()}> Reset Servos </button>

    <button on:click={() => websocket.balancePumpAndValve()}>
      Balance Pump & Valve</button
    >

    <button on:click={() => websocket.releaseValve(500)}> Shoot </button>

    <button on:click={() => websocket.changeValveState(false)}>
      off valve
    </button>

    <button on:click={() => websocket.changeValveState(true)}>
      on valve
    </button>

    <button on:click={() => websocket.changePumpState(false)}>
      off pump
    </button>

    <button on:click={() => websocket.changePumpState(true)}> on pump </button>

    <button on:click={() => websocket.turnOffAllRelays()}>
      off All relays
    </button>

    <button on:click={() => websocket.setAutoMode(true)}> on Auto Mode </button>

    <button on:click={() => websocket.setAutoMode(false)}>
      off Auto Mode
    </button>

    <h3>Auto Mode State: {$autoModeState}</h3>
    <!-- <button on:click={() => websocket.printServoPos()}>Print servo pos</button> -->
  </div>
</div>

<style>
  .control {
    width: 400px;
    height: 500px;
    background-color: rgba(215, 246, 250, 0.073);
    position: absolute;
    top: 40%;
    right: 2%;
    transform: translate(-2%, -40%);
    z-index: 1;
    opacity: 0.6;
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
