<script lang="ts">
    import { Button, Input, Label } from "flowbite-svelte";

    let creatingAccount = false;
    let username = "";
    let email = "";
    let password = "";
    let errorMsg = "";
    let loading = false;

    // Redirect if token is valid
    function isTokenValid(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            // Check expiration
            return !payload.exp || payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token && isTokenValid(token)) {
            window.location.href = "/select-tournament";
        }
    }

    // Handle form submit
    async function submitForm(event: Event) {
        event.preventDefault();
        loading = true;
        errorMsg = "";
        const endpoint = creatingAccount ? "/api/create-account" : "/api/login";
        const body = creatingAccount
            ? { username, email, password }
            : { username, password };
        try {
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (!res.ok) {
                errorMsg = data.error || "Login failed";
            } else {
                // Store JWT token
                localStorage.setItem("token", data.token);
                // Redirect to home
                window.location.href = "/select-tournament";
            }
        } catch (e) {
            errorMsg = "Server error";
        }
        loading = false;
    }
</script>

<section class="max-w-2xl mx-auto p-6 bg-gray-100 rounded-md shadow-md">
    <Button
        onclick={() => (creatingAccount = !creatingAccount)}
        color="blue"
        outline
        class="mb-5 w-full"
    >
        {creatingAccount ? "Log In to Existing Account" : "Create New Account"}
    </Button>

    <h1 class="text-2xl font-bold mb-4">
        {creatingAccount ? "Create New Account" : "Log In to Your Account"}
    </h1>

    {#if errorMsg}
        <div class="mb-3 text-red-600">{errorMsg}</div>
    {/if}

    <form on:submit={submitForm}>
        <div class="mb-3">
            <Label for="username" class="font-medium">Username</Label>
            <Input
                name="username"
                type="text"
                placeholder="Username"
                bind:value={username}
                required
            />
        </div>

        {#if creatingAccount}
            <div class="mb-3">
                <Label for="email" class="font-medium">Email</Label>
                <Input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    bind:value={email}
                    required
                />
            </div>
        {/if}

        <div class="mb-5">
            <Label for="password" class="font-medium">Password</Label>
            <Input
                name="password"
                type="password"
                placeholder="Password"
                bind:value={password}
                required
            />
        </div>

        <button
            type="submit"
            class="w-full bg-slate-500 text-white font-bold py-2 rounded-md"
            disabled={loading}
        >
            {creatingAccount ? "Create Account" : "Log In"}
        </button>
    </form>
</section>
