<script lang="ts">
  import { page } from "$app/state";

  const params = Object.fromEntries(
    new URLSearchParams(decodeURI(page.url.search)).entries(),
  );
</script>

<h1>Manage Tournament</h1>
<pre>{JSON.stringify(params)}</pre>
