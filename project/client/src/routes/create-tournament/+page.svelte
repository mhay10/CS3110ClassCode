<script lang="ts">
  import type { BracketCreationType } from "$lib/types/bracket-creation";
  import { Button, Input, Label, Select } from "flowbite-svelte";

  const createTournament = $state(true);

  let bracketCount = $state<number>(1);
  let bracketTypes = [
    { value: "singles", name: "Singles" },
    { value: "doubles", name: "Doubles" },
  ];
  let selectedBracketTypes = $derived<BracketCreationType[]>(
    Array(bracketCount).fill({ type: "singles", numPlayers: 2 }),
  );

  function createNewTournament() {
    console.log("Creating new tournament");
  }

  function selectExistingTournament() {
    console.log("Selecting existing tournament");
  }
</script>

<section>
  {#if createTournament}
    <h1>Create New Tournament</h1>

    <form method="post" onsubmit={createNewTournament}>
      <Label for="tournament-name">Tournament Name</Label>
      <Input
        name="tournament-name"
        type="text"
        placeholder="Tournament Name"
        required
      />

      <Label for="bracket-count">Number of Brackets</Label>
      <Input
        name="bracket-count"
        type="number"
        min="1"
        bind:value={bracketCount}
        required
      />

      {#each { length: bracketCount }, i}
        <article>
          <h2>Bracket {i + 1}</h2>

          <Label for="bracket-type-{i}">Bracket Type</Label>
          <Select
            name="bracket-type-{i}"
            items={bracketTypes}
            bind:value={selectedBracketTypes[i].type}
            required
          />

          <Label for="player-count-{i}">Player Count</Label>
          <Input
            name="player-count-{i}"
            type="number"
            min="2"
            bind:value={selectedBracketTypes[i].numPlayers}
            required
          />
        </article>
      {/each}
    </form>
  {:else}
    <h1>Select Existing Tournament</h1>
  {/if}
</section>
