<script lang="ts">
  import { Button, Toggle } from "flowbite-svelte";
  import TournamentCreationForm from "./TournamentCreationForm.svelte";
  import TournamentSelectionForm from "./TournamentSelectionForm.svelte";

  let createTournament = $state(false);
  function toggleCreateTournament() {
    createTournament = !createTournament;
  }
</script>

<section class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
  <Button
    onclick={toggleCreateTournament}
    color="blue"
    outline
    class="mb-5 w-full"
  >
    {createTournament ? "Select Existing Tournament" : "Create New Tournament"}
  </Button>

  {#if createTournament}
    <TournamentCreationForm />
  {:else}
    <TournamentSelectionForm />
  {/if}
</section>
