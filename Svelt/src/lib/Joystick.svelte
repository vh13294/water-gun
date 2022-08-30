<script>
  // @ts-nocheck

  import websocket from "./websocket";
  import { longPress } from "./longpress";
</script>

<div class="d-pad">
  <div
    class="up border"
    use:longPress
    on:longpress={() => websocket.moveServoPitch(-10)}
    on:click={() => websocket.moveServoPitch(-5)}
  >
    <div class="triangle-up" />
  </div>
  <div
    class="down border"
    use:longPress
    on:longpress={() => websocket.moveServoPitch(10)}
    on:click={() => websocket.moveServoPitch(5)}
  >
    <div class="triangle-down" />
  </div>
  <div
    class="right border"
    use:longPress
    on:longpress={() => websocket.moveServoYaw(-10)}
    on:click={() => websocket.moveServoYaw(-5)}
  >
    <div class="triangle-right" />
  </div>
  <div
    class="left border"
    use:longPress
    on:longpress={() => websocket.moveServoYaw(10)}
    on:click={() => websocket.moveServoYaw(5)}
  >
    <div class="triangle-left" />
  </div>
</div>

<style>
  .d-pad {
    position: absolute;
    height: 500px;
    width: 500px;
    touch-action: manipulation;
    z-index: 1;
    opacity: 0.8;
    top: 40%;
    left: 1%;
    transform: translate(-1%, -40%);
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

  .triangle-left {
    position: absolute;
    width: 0;
    height: 0;
    border-top: 30px solid transparent;
    border-right: 40px solid rgb(205, 121, 222);
    border-bottom: 30px solid transparent;
    top: 50%;
    left: 40%;
    transform: translate(-40%, -50%);
    transition: all 1s ease;
  }

  .d-pad .left:hover .triangle-left {
    top: 50%;
    left: 30%;
    transform: translate(-30%, -50%);
  }

  .triangle-down {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    border-top: 40px solid rgb(104, 196, 120);
    top: 60%;
    left: 50%;
    transform: translate(-50%, -60%);
    transition: all 1s ease;
  }

  .d-pad .down:hover .triangle-down {
    top: 70%;
    left: 50%;
    transform: translate(-50%, -70%);
  }

  @media only screen and (max-width: 1200px) {
    .d-pad {
      top: 50%;
      transform: scale(0.5) translate(0, -50%);
      transform-origin: top left;
    }
  }
</style>
