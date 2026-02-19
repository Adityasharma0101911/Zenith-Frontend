// central helper for backend requests

// this is the live tailscale link
//"https://endoserver.tail9ef134.ts.net"
export const API_URL = "http://127.0.0.1:5000";

// this function takes an endpoint and fetches data from the backend
export async function fetchAPI(endpoint: string) {
    // make the request to the backend using the base url and endpoint
    const response = await fetch(`${API_URL}${endpoint}`);
    return response;
}
