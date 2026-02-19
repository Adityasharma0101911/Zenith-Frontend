// central helper for backend requests

// this is the live tailscale link
export const API_URL = "https://endoserver.tail9ef134.ts.net";

// this formats a number as a dollar amount
export function formatCurrency(num: number): string {
    return `$${num.toFixed(2)}`;
}

// this function takes an endpoint and fetches data from the backend
export async function fetchAPI(endpoint: string) {
    // make the request to the backend using the base url and endpoint
    const response = await fetch(`${API_URL}${endpoint}`);
    return response;
}
