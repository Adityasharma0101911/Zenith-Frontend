// central helper for backend requests

// this is the live tailscale link
export const API_URL = "https://endoserver.tail9ef134.ts.net";

// safely read auth token from localStorage
export function getToken(): string | null {
    try {
        return localStorage.getItem("token");
    } catch {
        return null;
    }
}

// this formats a number as a dollar amount
export function formatCurrency(num: number): string {
    return `$${num.toFixed(2)}`;
}

// safe number formatter — guards against null/undefined/NaN
export function safeFixed(val: unknown, digits = 2): string {
    const n = Number(val);
    return isNaN(n) ? "0.00" : n.toFixed(digits);
}

// typed fetch wrapper with res.ok check and auth header injection
export async function apiFetch<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (options.body && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

    const res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed with status ${res.status}`);
    }
    return res.json();
}

// legacy wrapper kept for backwards compat
export async function fetchAPI(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return response;
}
