<script lang="ts">
  import { page } from "$app/state";
  import type { Tournament } from "$lib/types/manageTournament";
  import { onMount } from "svelte";

  let params = $state<{ [k: string]: string }>({});
  let tournamentData = $state<Tournament | null>(null);
  let hasTournamentData = $derived(!!tournamentData);
  let managingPlayers = $state(true);

  onMount(() => {
    params = Object.fromEntries(page.url.searchParams.entries());

    // Get tournament data from server
    if (params.tournament) {
      fetch("/api/tournament-data?" + new URLSearchParams(params))
        .then((res) => res.json())
        .then((data) => {
          tournamentData = data;
          console.log("Tournament Data:", tournamentData);
        });
    }
  });
</script>

<header class="w-full bg-gray-200 mb-6 rounded-md shadow-md">
  <nav class="w-full p-2">
    <ul class="w-full flex justify-around space-around mx-auto">
      <li class="w-[80%]">
        <button
          onclick={() => (managingPlayers = true)}
          class="w-full {managingPlayers ? 'font-bold' : ''}"
        >
          Manage Players
        </button>
      </li>
      <li class="w-[80%]">
        <button
          onclick={() => (managingPlayers = false)}
          class="w-full {managingPlayers ? '' : 'font-bold'}"
        >
          Manage Brackets
        </button>
      </li>
    </ul>
  </nav>
</header>

{#if hasTournamentData}
  {#if managingPlayers}
    <h1>Manage Players</h1>
  {:else}
    <h1>Manage Brackets</h1>
  {/if}
{:else}
  <h1>Tournament Not Found</h1>
{/if}
