<script lang="ts">
  import TournamentCreationForm from "./TournamentCreationForm.svelte";
  import TournamentSelectionForm from "./TournamentSelectionForm.svelte";

  const createTournament = $state(false);

  function selectExistingTournament() {
    console.log("Selecting existing tournament");
  }
</script>

<section class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
  {#if createTournament}
    <TournamentCreationForm />
  {:else}
    <TournamentSelectionForm />
  {/if}
</section>
