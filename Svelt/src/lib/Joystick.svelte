<script>
  import { onMount } from "svelte";
  import websocket from "./websocket";

  onMount(() => {});
  const increment = () => {
    websocket.moveServoPitch();
    websocket.moveServoYaw();
  };
</script>

<div>
  <div class="d-pad">
    <div class="up border">
      <div class="triangle-up" />
    </div>
    <div class="right border">
      <div class="triangle-right" />
    </div>
    <div class="down border">
      <div class="triangle-down" />
    </div>
    <div class="left border">
      <div class="triangle-left" />
    </div>
  </div>
</div>

<style>
  .d-pad {
    position: relative;
    height: 500px;
    width: 500px;
  }

  .d-pad .up {
    position: absolute;
    height: 200px;
    width: 150px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: white;
  }

  .d-pad .left {
    position: absolute;
    height: 150px;
    width: 200px;
    top: 50%;
    transform: translate(0, -50%);
    background-color: white;
  }

  .d-pad .right {
    position: absolute;
    height: 150px;
    width: 200px;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
    background-color: white;
  }

  .d-pad .down {
    position: absolute;
    height: 200px;
    width: 150px;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 0);
    background-color: white;
  }

  .border {
    border-radius: 30px;
  }

  .triangle-up {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-bottom: 40px solid rgb(95, 142, 168);
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
    transition: all 1s ease;
  }

  .d-pad .up:hover .triangle-up {
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
  }

  .triangle-right {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-left: 40px solid rgb(220, 161, 98);
    border-bottom: 30px solid transparent;
    top: 50%;
    left: 60%;
    transform: translate(-60%, -50%);
    transition: all 1s ease;
  }

  .d-pad .right:hover .triangle-right {
    top: 50%;
    left: 70%;
    transform: translate(-70%, -50%);
  }
</style>
