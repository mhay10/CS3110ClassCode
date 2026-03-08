<script lang="ts">
  import type { TournamentProps } from "$lib/types/manageTournament";

  let { tournamentData }: TournamentProps = $props();
</script>

<pre>{JSON.stringify(tournamentData)}</pre>
