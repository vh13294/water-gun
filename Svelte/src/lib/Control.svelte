<script lang="ts">
  import websocket from "./websocket";

  let autoModeState = false;
  websocket.autoModeState.subscribe((value) => {
    autoModeState = value;
  });
</script>

<div class="control">
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
    <button on:click={() => websocket.resetServos()}> Reset Servos </button>

    <button on:click={() => websocket.releaseValve(1500)}> Shoot </button>

    <button on:click={() => websocket.changeValveState(false)}>
      Turn off valve
    </button>

    <button on:click={() => websocket.changeValveState(true)}>
      Turn on valve
    </button>

    <button on:click={() => websocket.changePumpState(false)}>
      Turn off pump
    </button>

    <button on:click={() => websocket.changePumpState(true)}>
      Turn on pump
    </button>

    <button on:click={() => websocket.turnOffAllRelays()}>
      Turn off All relays
    </button>

    <button on:click={() => websocket.setAutoMode(true)}>
      Turn on Auto Mode
    </button>

    <button on:click={() => websocket.setAutoMode(false)}>
      Turn off Auto Mode
    </button>

    <h3>Auto Mode State: {autoModeState}</h3>
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

  h3 {
    color: black;
  }
</style>
