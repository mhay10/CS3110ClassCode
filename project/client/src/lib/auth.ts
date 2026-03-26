import { writable, derived } from "svelte/store";

// Token store - directly writable
function createTokenStore() {
    // Get initial token from localStorage (use "token" key to match login page)
    let initialToken: string | null = null;

    if (typeof window !== "undefined") {
        initialToken = localStorage.getItem("token");
    }

    const { subscribe, set } = writable<string | null>(initialToken);

    return {
        subscribe,
        set: (token: string | null) => {
            if (typeof window !== "undefined") {
                if (token) {
                    localStorage.setItem("token", token);
                } else {
                    localStorage.removeItem("token");
                }
            }
            set(token);
        },
    };
}

export const token = createTokenStore();

// Derived store - true if token exists
export const isLoggedIn = derived(token, ($token) => !!$token);

// Set token
export function setToken(newToken: string | null) {
    token.set(newToken);
}

// Logout function
export async function logout() {
    try {
        const response = await fetch("/api/logout", {
            method: "POST",
        });
    } catch (error) {
        console.error("Logout failed:", error);
    } finally {
        setToken(null);
    }
}
