<script lang="ts">
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import ManageBrackets from "../manage-tournament/ManageBrackets.svelte";
    import type { Tournament } from "$lib/types/manageTournament";

    let params = $state<{ [k: string]: string }>({});
    let tournamentData = $state<{ tournament: Tournament } | null>(null);
    let publicTournaments = $state<{ name: string; value: string }[]>([]);

    onMount(async () => {
        params = Object.fromEntries(page.url.searchParams.entries());

        if (params.tournament) {
            try {
                const res = await fetch(
                    "/api/tournament-data?" + new URLSearchParams(params),
                );
                if (res.ok) {
                    const data = await res.json();
                    tournamentData = data;
                }
            } catch (err) {
                console.error("Failed to load tournament", err);
            }
        }

        // Always fetch the list, or fetch it if no tournament is selected
        if (!params.tournament) {
            try {
                const res = await fetch("/api/public-tournaments");
                if (res.ok) {
                    const data = await res.json();
                    publicTournaments = data.tournaments;
                }
            } catch (err) {
                console.error("Failed to fetch tournaments list", err);
            }
        }
    });

    function handleSelect(name: string) {
        window.location.href = `/view-tournament?tournament=${encodeURIComponent(name)}`;
    }
</script>

<div class="w-full max-w-4xl mx-auto mt-8 p-4">
    <h1 class="text-3xl font-bold mb-6">Visitor View</h1>

    {#if params.tournament}
        {#if tournamentData}
            <h2 class="text-2xl font-bold mb-4">
                Viewing Bracket: {tournamentData.tournament.name}
            </h2>
            <div class="mb-6">
                <!-- We pass tournament from within tournamentData object as props correctly expected by ManageBrackets component -->
                <ManageBrackets {tournamentData} />
            </div>
            <div class="mt-4">
                <a href="/view-tournament" class="text-blue-600 hover:underline"
                    >&larr; Back to Public Tournaments list</a
                >
            </div>
        {:else}
            <p>Loading tournament data...</p>
        {/if}
    {:else}
        <h2 class="text-xl font-semibold mb-4">Available Tournaments</h2>
        {#if publicTournaments.length > 0}
            <ul class="space-y-4">
                {#each publicTournaments as t}
                    <li class="bg-white p-4 shadow rounded border">
                        <button
                            onclick={() => handleSelect(t.name)}
                            class="text-blue-600 hover:text-blue-800 hover:underline font-bold text-lg"
                        >
                            {t.name}
                        </button>
                    </li>
                {/each}
            </ul>
        {:else}
            <p class="text-gray-500">
                No public tournaments available right now.
            </p>
        {/if}
    {/if}
</div>
