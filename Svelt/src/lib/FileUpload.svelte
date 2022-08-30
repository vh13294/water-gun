<script>
  import tensorflow from "./tensorflow";

  let avatar, fileinput, imageElement;

  const onFileSelected = (e) => {
    const image = e.target.files[0];
    loadImage(image);
  };

  function loadImage(image) {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
      getPose();
    };
  }

  async function getPose() {
    const pose = await tensorflow.getPose(imageElement);
    console.log(pose);
  }
</script>

<div id="app">
  <h1>Upload Image</h1>

  {#if avatar}
    <img class="avatar" src={avatar} alt="d" bind:this={imageElement} />
  {:else}
    <img
      class="avatar"
      src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png"
      alt=""
    />
  {/if}
  <img
    class="upload"
    src="https://static.thenounproject.com/png/625182-200.png"
    alt=""
    on:click={() => {
      fileinput.click();
    }}
  />
  <div
    class="chan"
    on:click={() => {
      fileinput.click();
    }}
  >
    Choose Image
  </div>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change={(e) => onFileSelected(e)}
    bind:this={fileinput}
  />
</div>

<style>
  .upload {
    display: flex;
    height: 50px;
    width: 50px;
    cursor: pointer;
  }
  .avatar {
    display: flex;
    height: 200px;
    width: 200px;
  }
</style>
