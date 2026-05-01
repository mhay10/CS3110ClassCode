<script lang="ts">
    import type { Bracket, Round, Match } from "$lib/types/manageTournament";
    import {
        generateBracketRounds,
        mapExistingMatchesToRounds,
    } from "$lib/bracket";
    import { createEventDispatcher } from "svelte";

    let {
        bracket,
        isAdmin = false,
        isEditing = $bindable(false),
    }: any = $props();

    let rounds = $state<Round[]>([]);
    let baseRounds = $state<Round[]>([]);
    let scores = $state<Record<string, { p1: string; p2: string }>>({});
    let winners = $state<Record<string, string | null>>({});

    const dispatch = createEventDispatcher();

    function applyWinnersToRounds(
        roundsIn: Round[],
        winnersMap: Record<string, string | null>,
    ) {
        // Deep-copy rounds so we don't mutate original generated structure
        const out: Round[] = roundsIn.map((r) => ({
            round: r.round,
            matches: r.matches.map((m) => ({ ...m })),
        }));

        for (let r = 1; r < out.length; r++) {
            const prev = out[r - 1].matches;
            const cur = out[r].matches;
            for (let i = 0; i < cur.length; i++) {
                const left = prev[i * 2];
                const right = prev[i * 2 + 1];

                const leftWinner = winnersMap[left.id] ?? left.winnerId ?? null;
                const rightWinner =
                    winnersMap[right.id] ?? right.winnerId ?? null;

                cur[i].player1Id = leftWinner ?? null;
                cur[i].player2Id = rightWinner ?? null;
            }
        }

        return out;
    }

    $effect(() => {
        const b = bracket;
        if (!b) {
            rounds = [];
            baseRounds = [];
            scores = {};
            winners = {};
            return;
        }

        let generated = generateBracketRounds(b);
        generated = mapExistingMatchesToRounds(b, generated);
        baseRounds = generated;

        const s: Record<string, { p1: string; p2: string }> = {};
        const w: Record<string, string | null> = {};
        for (const r of generated) {
            for (const m of r.matches) {
                let p1 = "";
                let p2 = "";
                if (m.score && typeof m.score === "object") {
                    p1 = m.score.p1 ?? "";
                    p2 = m.score.p2 ?? "";
                }
                s[m.id] = { p1, p2 };
                w[m.id] = m.winnerId || null;
            }
        }
        scores = s;
        winners = w;

        // apply any known winners (server or local) to populate next-round slots
        rounds = applyWinnersToRounds(baseRounds, winners);
    });

    function handleWinnerChange(matchId: string, selectedId: string | null) {
        winners = { ...winners, [matchId]: selectedId };
        rounds = applyWinnersToRounds(baseRounds, winners);
        isEditing = true;
    }

    function getPlayerName(id: string | null) {
        if (!id) return "";
        const p = bracket?.players.find((pl) => pl.id === id);
        return p ? p.name : "TBD";
    }

    function onSave() {
        dispatch("save", { scores, winners });
        isEditing = false;
    }
</script>

<div class="w-full overflow-x-auto py-12">
    <div class="flex items-stretch min-h-[400px] gap-12 px-6">
        {#each rounds as round, rIndex}
            <div class="flex flex-col min-w-[240px] relative">
                <h3
                    class="font-semibold text-center text-gray-700 absolute -top-8 w-full"
                >
                    Round {round.round}
                </h3>
                {#each round.matches as match, mIndex}
                    <div
                        class="flex-1 flex flex-col justify-center relative py-2"
                    >
                        <!-- Connecting Lines -->
                        {#if rIndex < rounds.length - 1}
                            <!-- Line out to right -->
                            <div
                                class="absolute -right-6 top-1/2 w-6 h-px bg-gray-300"
                            ></div>
                            <!-- Vertical Drop linking even (top) match to the odd (bottom) match -->
                            {#if mIndex % 2 === 0}
                                <div
                                    class="absolute -right-6 top-1/2 w-px h-full bg-gray-300"
                                ></div>
                            {/if}
                        {/if}

                        <!-- Draw brackets connecting from the Next round backwards (Leftwards) -->
                        {#if rIndex > 0}
                            <div
                                class="absolute -left-6 top-1/2 w-6 h-px bg-gray-300"
                            ></div>
                        {/if}

                        <div
                            class="bg-white border border-gray-200 rounded-lg shadow-sm p-3 w-full flex flex-col justify-center relative z-10"
                        >
                            <div
                                class="flex justify-between items-center text-sm mb-2"
                            >
                                <div
                                    class="text-left font-medium text-gray-800 truncate pr-2 flex items-center gap-1"
                                >
                                    {#if isAdmin && match.player1Id}
                                        <input
                                            type="radio"
                                            name={`winner-${match.id}`}
                                            value={match.player1Id}
                                            checked={winners[match.id] ===
                                                match.player1Id}
                                            on:change={(e) =>
                                                handleWinnerChange(
                                                    match.id,
                                                    e.target.value,
                                                )}
                                        />
                                    {:else if winners[match.id] === match.player1Id}
                                        <span
                                            class="text-green-500 font-bold px-1"
                                            title="Winner">✓</span
                                        >
                                    {/if}
                                    <span
                                        class={winners[match.id] ===
                                        match.player1Id
                                            ? "font-bold text-green-700"
                                            : ""}
                                    >
                                        {#if match.player1Id}{getPlayerName(
                                                match.player1Id,
                                            )}{:else if rIndex > 0}Winner of R{round.round -
                                                1}M{mIndex * 2 + 1}{:else}<span
                                                class="italic text-gray-400"
                                                >TBD</span
                                            >{/if}
                                    </span>
                                </div>
                                <div class="w-16 text-right shrink-0">
                                    {#if isAdmin}
                                        <input
                                            class="w-full text-right border bg-gray-50 focus:bg-white rounded px-2 py-1 text-sm font-semibold transition-colors"
                                            bind:value={scores[match.id].p1}
                                            on:input={() => (isEditing = true)}
                                            on:focus={() => (isEditing = true)}
                                            on:blur={() => {}}
                                            placeholder="-"
                                        />
                                    {:else}
                                        <span
                                            class="text-sm font-semibold text-gray-700"
                                            >{scores[match.id].p1 || "-"}</span
                                        >
                                    {/if}
                                </div>
                            </div>

                            <div class="w-full h-px bg-gray-100 mb-2"></div>

                            <div
                                class="flex justify-between items-center text-sm"
                            >
                                <div
                                    class="text-left font-medium text-gray-800 truncate pr-2 flex items-center gap-1"
                                >
                                    {#if isAdmin && match.player2Id}
                                        <input
                                            type="radio"
                                            name={`winner-${match.id}`}
                                            value={match.player2Id}
                                            checked={winners[match.id] ===
                                                match.player2Id}
                                            on:change={(e) =>
                                                handleWinnerChange(
                                                    match.id,
                                                    e.target.value,
                                                )}
                                        />
                                    {:else if winners[match.id] === match.player2Id}
                                        <span
                                            class="text-green-500 font-bold px-1"
                                            title="Winner">✓</span
                                        >
                                    {/if}
                                    <span
                                        class={winners[match.id] ===
                                        match.player2Id
                                            ? "font-bold text-green-700"
                                            : ""}
                                    >
                                        {#if match.player2Id}{getPlayerName(
                                                match.player2Id,
                                            )}{:else if rIndex > 0}Winner of R{round.round -
                                                1}M{mIndex * 2 + 2}{:else}<span
                                                class="italic text-gray-400"
                                                >TBD</span
                                            >{/if}
                                    </span>
                                </div>
                                <div class="w-16 text-right shrink-0">
                                    {#if isAdmin}
                                        <input
                                            class="w-full text-right border bg-gray-50 focus:bg-white rounded px-2 py-1 text-sm font-semibold transition-colors"
                                            bind:value={scores[match.id].p2}
                                            on:input={() => (isEditing = true)}
                                            on:focus={() => (isEditing = true)}
                                            on:blur={() => {}}
                                            placeholder="-"
                                        />
                                    {:else}
                                        <span
                                            class="text-sm font-semibold text-gray-700"
                                            >{scores[match.id].p2 || "-"}</span
                                        >
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        {/each}
    </div>

    {#if isAdmin}
        <div class="mt-8 px-6 flex justify-start">
            <button
                class="px-6 py-2 bg-blue-600 font-medium text-white shadow-sm rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all"
                on:click={onSave}>Save Scores</button
            >
        </div>
    {/if}
</div>
