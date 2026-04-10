<script lang="ts">
    import type {
        TournamentProps,
        Tournament,
    } from "$lib/types/manageTournament";
    import { onMount, onDestroy } from "svelte";

    let { tournamentData }: TournamentProps = $props();

    let liveTournamentData = $state<Tournament | null>(null);
    let intervalId: any;

    onMount(() => {
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
            ).toLocaleString()}</span
        >
    {:else}
        <i>No recent updates.</i>
    {/if}
</div>

<pre>{JSON.stringify(
        liveTournamentData || tournamentData?.tournament,
        null,
        2,
    )}</pre>
