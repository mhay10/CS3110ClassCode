<script lang="ts">
  import type { BracketCreationType } from "$lib/types/selectTournament";
  import { Input, Label, Select } from "flowbite-svelte";

  async function createNewTournament(event: SubmitEvent) {
    // Prevent default form submission
    event.preventDefault();

    // Construct tournament data from form state
    const tournamentData = {
      name: tournamentName,
      brackets: JSON.parse(JSON.stringify(selectedBracketTypes)), // Copy to avoid mutation issues
    };

    // Send POST request to server
    const response = await fetch("/api/create-tournament", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournamentData),
    });

    console.log(response.ok);
  }

  let tournamentName = $state<string>("");
  let bracketCount = $state<number>(1);
  let bracketTypes = [
    { value: "singles", name: "Singles" },
    { value: "doubles", name: "Doubles" },
  ];
  let selectedBracketTypes = $state<BracketCreationType[]>([]);

  // Update bracket types whenever the bracket count changes
  $effect(() => {
    const currentCount = selectedBracketTypes.length;
    if (bracketCount > currentCount) {
      // Add empty bracket type
      selectedBracketTypes = [
        ...selectedBracketTypes,
        ...Array(bracketCount - currentCount).fill({
          type: null,
          numPlayers: 4,
        }),
      ];
    } else if (bracketCount < currentCount) {
      // Remove excess bracket types
      selectedBracketTypes = selectedBracketTypes.slice(0, bracketCount);
    }
  });
</script>

<h1 class="text-2xl font-bold mb-4">Create New Tournament</h1>

<form method="post" onsubmit={createNewTournament} class="text-sm">
  <div class="mb-3">
    <Label for="tournament-name" class="font-medium">Tournament Name</Label>
    <Input
      name="tournament-name"
      type="text"
      placeholder="Tournament Name"
      bind:value={tournamentName}
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

  {#each selectedBracketTypes as bracket, i}
    <article class="border p-4 rounded-md mb-5 bg-gray-50 border-gray-400">
      <h2 class="text-xl font-semibold mb-2">Bracket {i + 1}</h2>
      <div class="mb-3">
        <Label for="bracket-type-{i}" class="font-medium">Bracket Type</Label>
        <Select
          name="bracket-type-{i}"
          items={bracketTypes}
          bind:value={bracket.type}
          required
          class="w-full rounded-md border-gray-400"
        />
      </div>
      <div class="mb-3">
        <Label for="player-count-{i}" class="font-medium">Player Count</Label>
        <Input
          name="player-count-{i}"
          type="number"
          min="4"
          max="32"
          bind:value={bracket.numPlayers}
          required
        />
      </div>
    </article>
  {/each}

  <button
    type="submit"
    class="w-full bg-slate-500 text-white font-bold py-2 rounded-md"
  >
    Create Tournament
  </button>
</form>
