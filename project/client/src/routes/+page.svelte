<script lang="ts">
  import { Button, GradientButton } from "flowbite-svelte";
  import {
    UserGroupIcon,
    ComputerDesktopIcon,
    ShieldCheckIcon,
  } from "heroicons-svelte/24/solid";
</script>

<section class="flex flex-col items-center">
  <h1 class="text-4xl font-bold">Run Tennis Tournaments With Ease</h1>
  <p class="mt-5 text-lg mb-5">
    Manage and run tournaments without complex user interfaces
  </p>
  <img
    src="https://images.unsplash.com/photo-1567220720374-a67f33b2a6b9"
    alt="Tennis Court"
    class="w-5xl rounded-md"
  />
</section>

<section class="flex mt-10 gap-20 items-center justify-center">
  <GradientButton href="/select-tournament" color="blue" size="xl" class="text-lg"
    >Get Started</GradientButton
  >
  <Button
    href="/about"
    outline
    color="dark"
    size="xl"
    class="text-lg hover:bg-gray-100 hover:text-gray-700">Learn More</Button
  >
</section>

<section class="flex justify-around mt-15 w-max mx-auto gap-10">
  <article
    class="flex flex-col items-center flex-1 max-w-md p-5 rounded-md shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
  >
    <UserGroupIcon class="w-[70px] mb-5 fill-gray-700" />
    <h3 class="text-xl font-bold">Manage Multiple Tournaments</h3>
    <p class="mt-2">
      Run and manage multiple tennis tournaments from one place.
    </p>
  </article>

  <article
    class="flex flex-col items-center flex-1 max-w-md p-5 rounded-md shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
  >
    <ComputerDesktopIcon class="w-[70px] mb-5 fill-gray-700" />
    <h3 class="text-xl font-bold">Simple User Interface</h3>
    <p class="mt-2">
      Focus on running the tournament, not navigating the system.
    </p>
  </article>

  <article
    class="flex flex-col items-center flex-1 max-w-md p-5 rounded-md shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
  >
    <ShieldCheckIcon class="w-[70px] mb-5 fill-gray-700" />
    <h3 class="text-xl font-bold">Everything Stored Locally</h3>
    <p class="mt-2">
      All tournament data is stored locally in the browser for maximum privacy
    </p>
  </article>
</section>
