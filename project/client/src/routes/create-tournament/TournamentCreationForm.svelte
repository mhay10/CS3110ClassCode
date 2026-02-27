<script lang="ts">
  import type { BracketCreationType } from "$lib/types/bracket-creation";
  import { Input, Label, Select } from "flowbite-svelte";

  let bracketCount = $state<number>(1);
  let bracketTypes = [
    { value: "singles", name: "Singles" },
    { value: "doubles", name: "Doubles" },
  ];
  let selectedBracketTypes = $derived<BracketCreationType[]>(
    Array(bracketCount).fill({ type: "singles", numPlayers: 2 }),
  );

  function createNewTournament(event: SubmitEvent) {
    event.preventDefault();
    console.log("Creating new tournament");

    // TODO: POST form data to backend to create tournament
  }
</script>

<h1 class="text-2xl font-bold mb-4">Create New Tournament</h1>

<form method="post" onsubmit={createNewTournament} class="text-sm">
  <div class="mb-3">
    <Label for="tournament-name" class="font-medium">Tournament Name</Label>
    <Input
      name="tournament-name"
      type="text"
      placeholder="Tournament Name"
      required
      class="w-full rounded-md border-gray-400"
    />
  </div>
  <div class="mb-5">
    <Label for="bracket-count" class="font-medium">Number of Brackets</Label>
    <Input
      name="bracket-count"
      type="number"
      min="1"
      bind:value={bracketCount}
      required
      class="w-full rounded-md border-gray-400"
    />
  </div>

  {#each { length: bracketCount }, i}
    <article class="border p-4 rounded-md mb-4 bg-gray-50 border-gray-400">
      <h2 class="text-xl font-semibold mb-2">Bracket {i + 1}</h2>
      <div class="mb-3">
        <Label for="bracket-type-{i}" class="font-medium">Bracket Type</Label>
        <Select
          name="bracket-type-{i}"
          items={bracketTypes}
          bind:value={selectedBracketTypes[i].type}
          required
        />
      </div>
      <div class="mb-3">
        <Label for="player-count-{i}" class="font-medium">Player Count</Label>
        <Input
          name="player-count-{i}"
          type="number"
          min="2"
          max="32"
          bind:value={selectedBracketTypes[i].numPlayers}
          required
        />
      </div>
    </article>
  {/each}

  <button
    type="submit"
    class="w-full bg-slate-400 text-white font-bold py-2 rounded-md"
  >
    Create Bracket
  </button>
</form>
