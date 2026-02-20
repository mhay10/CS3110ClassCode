<script lang="ts">
  import { page } from "$app/state";
  import { Navbar, NavBrand, NavLi, NavUl } from "flowbite-svelte";
  import tennisball from "$lib/assets/tennisball.svg";

  const activeUrl = $derived(page.url.pathname);
</script>

<Navbar class="sticky top-0 bg-gray-800 text-white p-2 w-full" fluid={true}>
  <NavBrand href="/" class="ml-40">
    <img src={tennisball} alt="tennis ball icon bg" />
    <span class="ml-4 self-center whitespace-nowrap text-xl font-semibold">
      Tennis Tournament Manager
    </span>
  </NavBrand>
  <NavUl
    {activeUrl}
    class="!w-auto ml-auto mr-50"
    classes={{
      active: "font-bold underline text-white",
      nonActive: "text-slate-300",
      ul: "flex-row p-0 space-x-4 mt-0 text-sm font-medium bg-gray-800",
    }}
  >
    <NavLi href="/">Home</NavLi>
    <NavLi href="/about">About</NavLi>
  </NavUl>
</Navbar>
