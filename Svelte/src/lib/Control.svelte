<script lang="ts">
  import websocket from "./websocket";

  const streamUrl =
    import.meta.env.VITE_BASE_URL + import.meta.env.VITE_SERVER_URL;
  const shutdownUrl = `${streamUrl}/shutdown`;
  const rebootUrl = `${streamUrl}/reboot`;
  const autoTrackingUrl = `${streamUrl}/auto-tracking`;
  const autoShootUrl = `${streamUrl}/auto-shoot`;

  let showAdvancedSettings = false;
  let showAutoSettings = false;
  let showServerSettings = false;
  let showSecondaryShoot = false;
</script>

<div class="control">
  <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
    <button
      style="flex: 0 0 80%; height: 3rem;"
      on:click={() => websocket.releaseValve(500)}
    >
      Shoot (Valve)
    </button>

    <!-- <button on:click={() => websocket.printServoPos()}>Print servo pos</button> -->
  </div>

  <div style="background-color: rgba(244 163 163);">
    <button on:click={() => (showSecondaryShoot = !showSecondaryShoot)}>
      If valve is broken</button
    >

    {#if showSecondaryShoot}
      <div
        style="display: flex; flex-wrap: wrap; justify-content: space-around;"
      >
        <button
          style="flex: 0 0 80%; height: 3rem;"
          on:click={() => websocket.releasePump(1500)}
        >
          Shoot (Pump)
        </button>
      </div>
    {/if}
  </div>

  <div style="background-color: rgba(200 255 212);">
    <button on:click={() => (showAutoSettings = !showAutoSettings)}>
      Auto Mode</button
    >

    {#if showAutoSettings}
      <div
        style="display: flex; flex-wrap: wrap; justify-content: space-around;"
      >
        <button
          on:click={() =>
            fetch(autoTrackingUrl, {
              method: "POST",
              body: JSON.stringify({ state: true }),
            })}
        >
          Auto Tracking On
        </button>

        <button
          on:click={() =>
            fetch(autoTrackingUrl, {
              method: "POST",
              body: JSON.stringify({ state: false }),
            })}
        >
          Auto Tracking Off
        </button>

        <button
          on:click={() =>
            fetch(autoShootUrl, {
              method: "POST",
              body: JSON.stringify({ state: true, mode: "valve" }),
            })}
        >
          Auto Shoot On (Valve)
        </button>

        <button
          on:click={() =>
            fetch(autoShootUrl, {
              method: "POST",
              body: JSON.stringify({ state: false, mode: "valve" }),
            })}
        >
          Auto Shoot Off (Valve)
        </button>

        <button
          on:click={() =>
            fetch(autoShootUrl, {
              method: "POST",
              body: JSON.stringify({ state: true, mode: "pump" }),
            })}
        >
          Auto Shoot On (Pump)
        </button>

        <button
          on:click={() =>
            fetch(autoShootUrl, {
              method: "POST",
              body: JSON.stringify({ state: false, mode: "pump" }),
            })}
        >
          Auto Shoot Off (Pump)
        </button>
      </div>
    {/if}
  </div>

  <div style="background-color: rgba(244 213 163);">
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

  <div style="background-color: rgba(163 191 244);">
    <button on:click={() => (showServerSettings = !showServerSettings)}>
      Server</button
    >

    {#if showServerSettings}
      <div
        style="display: flex; flex-wrap: wrap; justify-content: space-around;"
      >
        <button on:click={() => fetch(shutdownUrl)}> Shutdown </button>

        <button on:click={() => fetch(rebootUrl)}> Reboot </button>
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
