<script>
  import { onMount } from "svelte";

  let count = 0;

  onMount(() => {});
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  count is {count}
</button>
