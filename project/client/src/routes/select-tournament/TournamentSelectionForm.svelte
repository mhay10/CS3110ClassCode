<script lang="ts">
  import { Label, Select } from "flowbite-svelte";

  function selectExistingTournaments(event: Event) {
    event.preventDefault();
    console.log("Selecting existing tournament");
  }

  // TODO: Change to GET request from backend
  let tournaments = [
    { value: "tournament1", name: "Tournament 1" },
    { value: "tournament2", name: "Tournament 2" },
    { value: "tournament3", name: "Tournament 3" },
  ];
</script>

<h1 class="text-2xl font-bold mb-4">Select Existing Tournament</h1>

<form onsubmit={selectExistingTournaments} class="text-sm">
  <div class="mb-5">
    <Label for="tournament-select" class="font-medium">Tournament Name</Label>
    <Select
      name="tournament-select"
      items={tournaments}
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
