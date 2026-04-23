<script lang="ts">
    import type {
        TournamentProps,
        Tournament,
        Bracket,
    } from "$lib/types/manageTournament";
    import { onMount, onDestroy } from "svelte";
    import { Label, Select } from "flowbite-svelte";

    let { tournamentData }: TournamentProps = $props();

    let lastUpdatedAt = $state<Date>(new Date(0));
    let liveTournamentData = $state<Tournament | null>(null);
    let intervalId: any;

    let selectedBracketName = $state<string>("");
    let selectedBracket = $derived<Bracket | null>(
        liveTournamentData
            ? liveTournamentData.brackets.find(
                  (b) => b.name === selectedBracketName,
              ) || null
            : null,
    );
    let availableBrackets = $derived(
        liveTournamentData
            ? liveTournamentData.brackets.map((b) => ({
                  value: b.name,
                  name: b.name,
              }))
            : [],
    );

    onMount(async () => {
        await Notification.requestPermission();

        liveTournamentData = tournamentData.tournament;

        const fetchTournament = async () => {
            if (!liveTournamentData) return;
            try {
                const res = await fetch(
                    "/api/tournament-data?tournament=" +
                        encodeURIComponent(liveTournamentData.name),
                );
                if (res.ok) {
                    const data = await res.json();
                    liveTournamentData = data.tournament;

                    // Notify mobile user
                    const serverUpdatedAt = new Date(
                        data.tournament.lastUpdatedAt,
                    ).getTime();
                    if (serverUpdatedAt > lastUpdatedAt.getTime()) {
                        console.log("Tournament updated, sending notification");

                        if (Notification.permission === "granted") {
                            // Send notification about update
                            new Notification("Tournament Updated", {
                                body: `The tournament "${liveTournamentData?.name}" has been updated.`,
                            });

                            // Vibrate mobile device for 500ms
                            navigator.vibrate(500);

                            // Update last updated time
                            lastUpdatedAt = new Date(serverUpdatedAt);
                        }
                    }
                }
            } catch (err) {
                console.error("Live update failed", err);
            }
        };

        intervalId = setInterval(fetchTournament, 2000);
    });

    onDestroy(() => {
        if (intervalId) clearInterval(intervalId);
    });
</script>

<div class="mb-4 text-sm text-gray-500">
    {#if liveTournamentData?.lastUpdatedAt}
        <span class="font-semibold text-blue-600"
            >Last updated at: {new Date(
                liveTournamentData.lastUpdatedAt,
            ).toLocaleString()}
            by {liveTournamentData?.lastModifiedBy || "Unknown"}</span
        >
    {:else}
        <i>No recent updates.</i>
    {/if}
</div>

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
    <pre>{JSON.stringify(selectedBracket.matches, null, 2)}</pre>
{:else}
    <p class="text-gray-500 mt-4">Please select a bracket to view matches.</p>
{/if}
