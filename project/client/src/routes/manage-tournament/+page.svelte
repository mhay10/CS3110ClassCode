<script lang="ts">
    import { page } from "$app/state";
    import type { Tournament } from "$lib/types/manageTournament";
    import { onMount } from "svelte";
    import ManagePlayers from "./ManagePlayers.svelte";
    import ManageBrackets from "./ManageBrackets.svelte";
    import ManageTournament from "./ManageTournament.svelte";

    let params = $state<{ [k: string]: string }>({});
    let tournamentData = $state<Tournament | null>(null);
    let activeTab = $state<"players" | "brackets" | "settings">("players");

    onMount(() => {
        params = Object.fromEntries(page.url.searchParams.entries());

        // Get tournament data from server
        if (params.tournament) {
            fetch("/api/tournament-data?" + new URLSearchParams(params))
                .then((res) => res.json())
                .then((data) => {
                    tournamentData = data;
                });
        }
    });
</script>

<header class="w-full bg-gray-200 mb-6 rounded-md shadow-md">
    <nav class="w-full p-2">
        <ul class="w-full flex justify-around space-around mx-auto">
            <li class="w-[80%]">
                <button
                    onclick={() => (activeTab = "players")}
                    class="w-full {activeTab === 'players' ? 'font-bold' : ''}"
                >
                    Manage Players
                </button>
            </li>
            <li class="w-[80%]">
                <button
                    onclick={() => (activeTab = "brackets")}
                    class="w-full {activeTab === 'brackets' ? 'font-bold' : ''}"
                >
                    Manage Brackets
                </button>
            </li>
            <li class="w-[80%]">
                <button
                    onclick={() => (activeTab = "settings")}
                    class="w-full {activeTab === 'settings' ? 'font-bold' : ''}"
                >
                    Tournament Settings
                </button>
            </li>
        </ul>
    </nav>
</header>

{#if !!tournamentData}
    {#if activeTab === "players"}
        <ManagePlayers {tournamentData} />
    {:else if activeTab === "brackets"}
        <ManageBrackets {tournamentData} />
    {:else if activeTab === "settings"}
        <ManageTournament {tournamentData} />
    {/if}
{:else}
    <h1>Tournament Not Found</h1>
{/if}
