<div class="camera">
  <img
    src="http://localhost:8080/?action=stream"
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
