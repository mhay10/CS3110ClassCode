<script lang="ts">
  import Footer from "./Footer.svelte";
  import Header from "./Header.svelte";
</script>

<Header />

<main class="mb-5 mt-10 text-center w-[80%] mx-auto min-h-screen">
  <slot />
</main>

<Footer />

<style>
  @import "tailwindcss";
  @plugin "flowbite/plugin";
  @custom-variant dark (&:where(.dark, .dark *));

  @source "../../node_modules/flowbite-svelte/dist";
</style>
