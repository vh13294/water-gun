<script>
  import tensorflow from "./tensorflow";

  let fileinput, canvas;

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    loadImage(url);
  };

  function loadImage(url) {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      getPose(img);
    };
  }

  async function getPose(img) {
    const pose = await tensorflow.getPose(img);
    console.log(pose);
    canvasDraw(img, pose[0].keypoints);
  }

  function canvasDraw(img, pointArr) {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = "rgba(200, 0, 0, 0.5)";

    pointArr.forEach((element) => {
      ctx.fillRect(element.x, element.y, 5, 5);
    });
  }
</script>

<div id="app">
  <h1>Upload Image</h1>
  <button
    on:click={() => {
      fileinput.click();
    }}
  >
    Upload
  </button>

  <canvas bind:this={canvas} width={2000} height={2000} />

  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
  />
</div>
