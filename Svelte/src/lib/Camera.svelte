<div class="camera">
  <!-- USE ROUTER IP -->
  <img
    src={import.meta.env.VITE_CAMERA_STREAM_URL}
    width="960"
    height="540"
    alt="camera"
  />
</div>

<style>
  .camera {
    width: 960px;
    height: 540px;
    background-color: antiquewhite;
    background-image: url("crosshair.svg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: 100px;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
  }

  @media only screen and (max-width: 1200px) {
    .camera {
      transform-origin: top left;
      transform: scale(0.7) translate(-50%, -50%);
    }
  }
</style>
