<script lang="ts">
    import type {
        TournamentProps,
        Tournament,
        Bracket,
        Round,
        Match,
    } from "$lib/types/manageTournament";
    import { onMount, onDestroy } from "svelte";
    import { Label, Select } from "flowbite-svelte";
    import TournamentBracket from "./TournamentBracket.svelte";
    import { token } from "$lib/auth";

    // accept isAdmin prop to toggle editable score inputs
    let { tournamentData, isAdmin = false }: any = $props();

    let lastUpdatedAt = $state<Date>(new Date(0));
    let liveTournamentData = $state<Tournament | null>(null);
    let intervalId: any;

    let isEditing = $state<boolean>(false);

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

    // bracket UI moved into `TournamentBracket.svelte`

    onMount(async () => {
        await Notification.requestPermission();

        liveTournamentData = tournamentData.tournament;

        const fetchTournament = async () => {
            if (!liveTournamentData || isEditing) return;
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
                            new Notification("Tournament Updated", {
                                body: `The tournament "${liveTournamentData?.name}" has been updated.`,
                            });
                            navigator.vibrate?.(500);
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

    function handleSave(detail: any) {
        if (!liveTournamentData || !selectedBracketName) return;

        const scoresMap = detail.scores;
        const winnersMap = detail.winners;
        const scoresUpdates = Object.keys(scoresMap).map((matchId) => ({
            matchId,
            score: scoresMap[matchId],
            winnerId: winnersMap[matchId],
        }));

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if ($token) {
            headers["Authorization"] = `Bearer ${$token}`;
        }

        fetch("/api/update-match-scores", {
            method: "PUT",
            headers,
            body: JSON.stringify({
                tournamentName: liveTournamentData.name,
                bracketName: selectedBracketName,
                scores: scoresUpdates,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    console.error("Failed to save scores via API");
                    alert("Failed to save scores.");
                    return;
                }
                try {
                    const data = await res.json();
                    if (data?.tournament) {
                        liveTournamentData = data.tournament;
                        console.log(
                            "Successfully saved scores and updated local tournament",
                        );
                    } else {
                        console.log("Successfully saved scores!");
                    }
                } catch (err) {
                    console.log(
                        "Saved scores but failed to parse response JSON",
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                alert("Error connecting to server.");
            });
    }
</script>

<div class="mb-4 text-sm text-gray-500">
    {#if liveTournamentData?.lastUpdatedAt}
        <span class="font-semibold text-blue-600"
            >Last updated at: {new Date(
                liveTournamentData.lastUpdatedAt,
            ).toLocaleString()} by {liveTournamentData?.lastModifiedBy ||
                "Unknown"}</span
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
    <div class="mx-auto mb-4 w-full">
        <h2 class="text-xl font-bold mb-2">
            Selected Bracket: <i>{selectedBracketName}</i>
        </h2>
        <TournamentBracket
            bracket={selectedBracket}
            {isAdmin}
            bind:isEditing
            on:save={(e) => handleSave(e.detail)}
        />
    </div>
{:else}
    <p class="text-gray-500 mt-4">Please select a bracket to view matches.</p>
{/if}
