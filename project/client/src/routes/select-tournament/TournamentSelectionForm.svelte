<script lang="ts">
    import type { BracketSelectionType } from "$lib/types/selectTournament";
    import { Label, Select } from "flowbite-svelte";

    function selectExistingTournaments(event: Event) {
        // Prevent form submission from refreshing page
        event.preventDefault();

        // Redirect to tournament management page
        if (selectedTournament) {
            window.location.href = `/manage-tournament?tournament=${encodeURIComponent(selectedTournament)}`;
        }
    }

    $effect(() => {
        const token =
            typeof window !== "undefined"
                ? localStorage.getItem("token")
                : null;
        fetch("/api/get-tournaments", {
            method: "GET",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.tournaments) {
                    tournaments = data.tournaments;
                }
            });
    });

    let tournaments = $state<BracketSelectionType[]>([]);
    let selectedTournament = $state<string>("");
</script>

<h1 class="text-2xl font-bold mb-4">Select Existing Tournament</h1>

<form onsubmit={selectExistingTournaments} class="text-sm">
    <div class="mb-5">
        <Label for="tournament-select" class="font-medium"
            >Tournament Name</Label
        >
        <Select
            name="tournament-select"
            items={tournaments}
            bind:value={selectedTournament}
            required
            class="w-full rounded-md border-gray-400"
        />
    </div>

    <button
        type="submit"
        class="w-full bg-slate-500 text-white font-bold py-2 rounded-md"
    >
        Select Tournament
    </button>
</form>
