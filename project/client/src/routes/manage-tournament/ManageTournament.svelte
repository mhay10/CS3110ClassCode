<script lang="ts">
    import type { Tournament } from "$lib/types/manageTournament";
    import { Input, Label } from "flowbite-svelte";
    import { token } from "$lib/auth";

    let { tournamentData } = $props();

    let tournament = $derived<Tournament>(tournamentData.tournament);
    let tournamentName = $state(tournament.name);
    let isLoading = $state(false);
    let successMessage = $state("");
    let errorMessage = $state("");

    async function onSaveClick(event: SubmitEvent) {
        event.preventDefault();
        isLoading = true;
        errorMessage = "";
        successMessage = "";

        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if ($token) {
                headers["Authorization"] = `Bearer ${$token}`;
            }

            const response = await fetch("/api/update-tournament", {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    oldName: tournament.name,
                    newName: tournamentName,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update tournament");
            }

            successMessage = "Tournament updated successfully!";
            tournament.name = tournamentName;

            // Clear success message after 3 seconds
            setTimeout(() => {
                successMessage = "";
            }, 3000);
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : "An error occurred";
        } finally {
            isLoading = false;
        }
    }

    async function onDeleteClick() {
        // First confirmation
        const firstConfirm = confirm(
            `Are you sure you want to delete the tournament "${tournament.name}"?`,
        );
        if (!firstConfirm) return;

        // Second confirmation
        const secondConfirm = confirm(
            "This action cannot be undone. All brackets, players, and match data will be permanently deleted.",
        );
        if (!secondConfirm) return;

        // Third confirmation
        const userInput = prompt(
            `To permanently delete "${tournament.name}", please type: DELETE`,
        );
        if (userInput !== "DELETE") {
            alert("Deletion cancelled. The text did not match.");
            return;
        }

        isLoading = true;
        errorMessage = "";

        try {
            const headers: Record<string, string> = {
                "Content-Type": "application/json",
            };
            if ($token) {
                headers["Authorization"] = `Bearer ${$token}`;
            }

            const response = await fetch("/api/delete-tournament", {
                method: "DELETE",
                headers,
                body: JSON.stringify({
                    tournamentName: tournament.name,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete tournament");
            }

            // Redirect to tournaments list
            if (typeof window !== "undefined") {
                window.location.href = "/tournaments";
            }
        } catch (error) {
            errorMessage =
                error instanceof Error ? error.message : "An error occurred";
            isLoading = false;
        }
    }
</script>

<section class="w-full max-w-lg mx-auto mb-6">
    <h2 class="text-xl font-bold mb-4">Tournament Settings</h2>

    {#if successMessage}
        <div
            class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md"
        >
            {successMessage}
        </div>
    {/if}

    {#if errorMessage}
        <div
            class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md"
        >
            {errorMessage}
        </div>
    {/if}

    <form onsubmit={onSaveClick} class="mb-6">
        <Label for="tournament-name" class="font-medium">Tournament Name</Label>
        <Input
            name="tournament-name"
            type="text"
            placeholder="Tournament Name"
            bind:value={tournamentName}
            class="w-full rounded-md border-gray-400 mt-1"
            disabled={isLoading}
        />

        <button
            type="submit"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            disabled={isLoading}
        >
            {isLoading ? "Saving..." : "Save Changes"}
        </button>
    </form>

    <div class="border-t pt-4">
        <h3 class="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
        <button
            type="button"
            onclick={onDeleteClick}
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
            disabled={isLoading}
        >
            {isLoading ? "Deleting..." : "Delete Tournament"}
        </button>
    </div>
</section>
