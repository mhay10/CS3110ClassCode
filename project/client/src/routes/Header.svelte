<script lang="ts">
    import { goto } from "$app/navigation";
    import { isLoggedIn, logout } from "$lib/auth";
    import tennisball from "$lib/assets/tennisball.svg";

    let open = false;

    async function handleLogout() {
        if (confirm("Are you sure you want to logout?")) {
            await logout();
            goto("/");
        }
    }

    function handleLogin() {
        goto("/login");
    }
</script>

<header class="sticky top-0 bg-gray-800 text-white w-full z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
            <a href="/" class="flex items-center">
                <img src={tennisball} alt="tennis ball icon" class="h-8 w-8" />
                <span class="ml-3 text-xl font-semibold whitespace-nowrap">Tennis Tournament Manager</span>
            </a>

            <div class="flex items-center">
                <button class="md:hidden p-2 rounded hover:bg-gray-700" on:click={() => (open = !open)} aria-label="Toggle menu" aria-expanded={open}>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        {#if !open}
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        {:else}
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        {/if}
                    </svg>
                </button>

                <nav class="hidden md:flex md:items-center md:space-x-6 ml-4">
                    <a href="/" class="text-slate-300 hover:text-white transition-colors">Home</a>
                    <a href="/about" class="text-slate-300 hover:text-white transition-colors">About</a>
                    <a href="/view-tournament" class="text-slate-300 hover:text-white transition-colors">Guest View</a>
                    {#if $isLoggedIn}
                        <button on:click={handleLogout} class="text-slate-300 hover:text-white transition-colors">Logout</button>
                    {:else}
                        <button on:click={handleLogin} class="text-slate-300 hover:text-white transition-colors">Login</button>
                    {/if}
                </nav>
            </div>
        </div>
    </div>

    {#if open}
        <div class="md:hidden px-2 pb-3 space-y-1 bg-gray-800">
            <a href="/" class="block px-3 py-2 rounded text-slate-300 hover:text-white transition-colors">Home</a>
            <a href="/about" class="block px-3 py-2 rounded text-slate-300 hover:text-white transition-colors">About</a>
            <a href="/view-tournament" class="block px-3 py-2 rounded text-slate-300 hover:text-white transition-colors">Guest View</a>
            {#if $isLoggedIn}
                <button on:click={handleLogout} class="w-full text-left px-3 py-2 rounded text-slate-300 hover:text-white transition-colors">Logout</button>
            {:else}
                <button on:click={handleLogin} class="w-full text-left px-3 py-2 rounded text-slate-300 hover:text-white transition-colors">Login</button>
            {/if}
        </div>
    {/if}
</header>
