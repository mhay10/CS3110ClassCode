<script lang="ts">
  import Header from "./Header.svelte";
</script>

<Header />

<main class="mb-5 mt-5 text-center">
  <slot />
</main>

<style>
  @import "tailwindcss";
  @plugin "flowbite/plugin";
  @custom-variant dark (&:where(.dark, .dark *));

  @source "../../node_modules/flowbite-svelte/dist";
</style>
