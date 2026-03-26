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
        // load saved bracket from sessionStorage on first run (client-only)
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem("selectedBracket");
            if (!selectedBracketName && saved) selectedBracketName = saved;
            // persist selection whenever it changes
            sessionStorage.setItem("selectedBracket", selectedBracketName);
        }
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

    // Snapshot of players before edits and deletion marks
    let originalPlayers = $state<Player[]>([]);
    // Track which slots the user has explicitly marked for deletion
    let markedForDeletion = $state<boolean[]>([]);
    $effect(() => {
        const bracket = selectedBracket; // only track bracket selection changes
        untrack(() => {
            if (bracket) {
                originalPlayers = bracket.players.map((p) => ({ ...p }));
                // initialize deletion marks to false for every slot when bracket changes
                markedForDeletion = bracket.players.map(() => false);
            } else {
                originalPlayers = [];
                markedForDeletion = [];
            }
        });
    });

    async function onSaveClick(event: SubmitEvent) {
        event.preventDefault();
        if (!selectedBracket) return;

        // Use browser confirm() to ask user before saving
        const ok =
            typeof window !== "undefined"
                ? confirm(
                      "Are you sure you want to save changes? This will apply additions/clears and reload the page.",
                  )
                : true;
        if (!ok) return;

        // Remove slots marked for deletion
        await removePlayers();

        // Add/update named players (skip slots marked for deletion)
        await addPlayers();

        // Refresh snapshot and clear marks
        originalPlayers = selectedBracket.players.map((p) => ({ ...p }));
        markedForDeletion = selectedBracket.players.map(() => false);

        // Persist selected bracket so reload reopens it
        if (typeof window !== "undefined") {
            sessionStorage.setItem("selectedBracket", selectedBracketName);
            // Reload page to pick up changes and restore bracket selection
            location.reload();
        }
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

        // Collect slots the user explicitly marked for deletion
        const players = [];
        for (let i = 0; i < markedForDeletion.length; i++) {
            if (markedForDeletion[i]) {
                const original = originalPlayers[i];
                // only send a remove request if there was an original non-empty player
                if (original && original.name.trim().length > 0) {
                    players.push({
                        playerName: original.name,
                        playerIndex: i,
                        playerSeed: original.seed,
                    });
                }
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

        // Clear the marked flags for any slots we requested removal for
        for (const p of players) {
            markedForDeletion[p.playerIndex] = false;
        }
    }

    // Toggle mark-for-deletion for a slot.
    // When marking: clear the visible inputs (blank name, seed -1).
    // When unmarking: restore values from the snapshot if available.
    function toggleMarkForDeletion(index: number) {
        if (!selectedBracket) return;
        const currentlyMarked = !!markedForDeletion[index];

        if (!currentlyMarked) {
            // Marking for deletion: blank the inputs so the user sees the slot is cleared.
            markedForDeletion[index] = true;
            // Guard against out-of-range index
            if (index >= 0 && index < selectedBracket.players.length) {
                selectedBracket.players[index].name = "";
                selectedBracket.players[index].seed = -1;
            }
        } else {
            // Unmarking: restore from the original snapshot if present
            const orig = originalPlayers[index];
            if (index >= 0 && index < selectedBracket.players.length) {
                if (orig) {
                    selectedBracket.players[index].name = orig.name;
                    selectedBracket.players[index].seed = orig.seed;
                } else {
                    // No snapshot available: leave blank
                    selectedBracket.players[index].name = "";
                    selectedBracket.players[index].seed = -1;
                }
            }
            markedForDeletion[index] = false;
        }
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

    <form onsubmit={onSaveClick}>
        <ul class="flex flex-col basis-full flex-1 w-full max-w-2xl mx-auto">
            {#each selectedBracket.players as player, i}
                <li
                    class={"flex flex-col items-center justify-center border rounded-md p-4 w-full mb-2 " +
                        (markedForDeletion[i]
                            ? "opacity-50 border-red-300"
                            : "")}
                >
                    <div class="w-full flex items-center justify-between">
                        <h3 class="text-lg font-bold">Player {i + 1}</h3>
                        <button
                            type="button"
                            onclick={() => toggleMarkForDeletion(i)}
                            class={"px-2 py-1 text-sm rounded " +
                                (markedForDeletion[i]
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300")}
                        >
                            {markedForDeletion[i]
                                ? "Marked for deletion"
                                : "Mark for deletion"}
                        </button>
                    </div>

                    <div class="flex gap-3 w-full mt-3">
                        <div>
                            <Label
                                for="player-seed-{i}"
                                class="font-medium text-left"
                            >
                                Seed
                            </Label>
                            <Input
                                name="player-seed-{i}"
                                type="number"
                                min="1"
                                max={selectedBracket.players.length}
                                value={player.seed === -1 ? "" : player.seed}
                                oninput={(e) => {
                                    const val = (e.target as HTMLInputElement)
                                        .valueAsNumber;
                                    player.seed = isNaN(val) ? -1 : val;
                                }}
                                class={"rounded-md border-gray-400 " +
                                    (markedForDeletion[i]
                                        ? "line-through"
                                        : "")}
                                disabled={markedForDeletion[i]}
                            />
                        </div>
                        <div class="flex-1">
                            <Label
                                for="player-name-{i}"
                                class="font-medium text-left"
                            >
                                Player Name
                            </Label>
                            <Input
                                name="player-name-{i}"
                                type="text"
                                placeholder="Player Name"
                                bind:value={player.name}
                                class={"w-full rounded-md border-gray-400 " +
                                    (markedForDeletion[i]
                                        ? "line-through"
                                        : "")}
                                disabled={markedForDeletion[i]}
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
