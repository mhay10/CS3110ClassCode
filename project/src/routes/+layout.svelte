<script lang="ts">
  import Header from "./Header.svelte";

  import "./layout.css";
</script>

<Header />

<main class="mb-5 mt-5 text-center">
  <slot />
</main>
