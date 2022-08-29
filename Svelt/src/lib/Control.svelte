<script>
</script>

<div class="control" />

<style>
  .control {
    width: 400px;
    height: 500px;
    background-color: rgb(215, 246, 250);
    position: absolute;
    top: 40%;
    right: 2%;
    transform: translate(-2%, -40%);
    z-index: 1;
    opacity: 0.6;
  }

  @media only screen and (max-width: 1200px) {
    .control {
      transform: scale(0.7);
      transform-origin: top right;
      top: 5%;
    }
  }
</style>
