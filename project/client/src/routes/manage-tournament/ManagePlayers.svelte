<script lang="ts">
  import type {
    Bracket,
    Player,
    Tournament,
  } from "$lib/types/manageTournament";
  import { untrack } from "svelte";
  import { Input, Label, Select } from "flowbite-svelte";

  let { tournamentData } = $props();

  $effect(() => {
    console.log("Managing bracket: ", selectedBracketName);
  });

  let tournament = $derived<Tournament>(tournamentData.tournament);
  let availableBrackets = $derived(
    tournament.brackets.map((b) => ({ value: b.name, name: b.name })),
  );
  let selectedBracketName = $state<string>("");
  let selectedBracket = $derived<Bracket | null>(
    tournament.brackets.find((b) => b.name === selectedBracketName) || null,
  );

  // Snapshot of players before edits
  let originalPlayers = $state<Player[]>([]);
  $effect(() => {
    const bracket = selectedBracket; // only track bracket selection changes
    untrack(() => {
      if (bracket) {
        originalPlayers = bracket.players.map((p) => ({ ...p }));
      }
    });
  });

  async function updateBracketPlayers(event: SubmitEvent) {
    event.preventDefault();
    if (!selectedBracket) return;

    // Remove cleared players
    await removePlayers();

    // Add/update named players
    await addPlayers();

    // Refresh snapshot
    originalPlayers = selectedBracket.players.map((p) => ({ ...p }));
    alert("Players updated successfully!");
  }

  async function addPlayers() {
    if (!selectedBracket) return;

    // Collect players with a name
    const players = [];
    for (let i = 0; i < selectedBracket.players.length; i++) {
      const player = selectedBracket.players[i];
      if (player.name.trim().length > 0) {
        players.push({
          playerName: player.name,
          playerIndex: i,
          playerSeed: player.seed,
        });
      }
    }

    if (players.length === 0) return;

    await fetch("/api/add-players", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournamentName: tournament.name,
        bracketName: selectedBracketName,
        players,
      }),
    });
  }

  async function removePlayers() {
    if (!selectedBracket) return;

    // Collect newly-emptied player slots
    const players = [];
    for (let i = 0; i < originalPlayers.length; i++) {
      const original = originalPlayers[i];
      const current = selectedBracket!.players[i];
      if (original.name.trim().length > 0 && !current.name.trim()) {
        players.push({
          playerName: original.name,
          playerIndex: i,
          playerSeed: original.seed,
        });
      }
    }

    if (players.length === 0) return;

    await fetch("/api/remove-players", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tournamentName: tournament.name,
        bracketName: selectedBracketName,
        players,
      }),
    });
  }
</script>

<section class="w-full max-w-lg mx-auto mb-6">
  <Label for="bracket-name">Select Bracket</Label>
  <Select
    name="bracket-name"
    items={availableBrackets}
    bind:value={selectedBracketName}
    required
    class="w-full rounded-md border-gray-400"
  />
</section>

{#if !!selectedBracket}
  <h2 class="text-xl font-bold mb-4">
    Selected Bracket: <i>{selectedBracketName}</i>
  </h2>

  <form onsubmit={updateBracketPlayers}>
    <ul class="flex flex-col basis-full flex-1 w-full max-w-2xl mx-auto">
      {#each selectedBracket.players as player, i}
        <li
          class="flex flex-col items-center justify-center border rounded-md p-4 w-full mb-2"
        >
          <h3 class="text-lg font-bold">Player {i + 1}</h3>
          <div class="flex gap-3 w-full mt-3">
            <div>
              <Label for="player-seed-{i}" class="font-medium text-left">
                Seed
              </Label>
              <Input
                name="player-seed-{i}"
                type="number"
                min="1"
                max={selectedBracket.players.length}
                value={player.seed === -1 ? "" : player.seed}
                oninput={(e) => {
                  const val = (e.target as HTMLInputElement).valueAsNumber;
                  player.seed = isNaN(val) ? -1 : val;
                }}
                class="rounded-md border-gray-400"
              />
            </div>
            <div class="flex-1">
              <Label for="player-name-{i}" class="font-medium text-left">
                Player Name
              </Label>
              <Input
                name="player-name-{i}"
                type="text"
                placeholder="Player Name"
                bind:value={player.name}
                class="w-full rounded-md border-gray-400"
              />
            </div>
          </div>
        </li>
      {/each}
    </ul>

    <button
      type="submit"
      class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >Save</button
    >
  </form>
{:else}
  <p class="text-gray-500 mt-4">Please select a bracket to manage.</p>
{/if}
