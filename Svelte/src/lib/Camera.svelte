<div>
  <!-- USE ROUTER IP -->
  <img
    src={import.meta.env.VITE_CAMERA_STREAM_URL}
    alt="camera"
    class="position"
  />

  <img alt="crosshair" class="position crosshair" />
</div>

<style>
  .crosshair {
    opacity: 0.8;
    background-image: url("/crosshair.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100px;
  }

  .position {
    height: 540px;
    width: 960px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
  }

  @media only screen and (max-width: 1200px) {
    .position {
      transform-origin: top left;
      transform: scale(0.7) translate(-50%, -50%);
    }
  }
</style>
