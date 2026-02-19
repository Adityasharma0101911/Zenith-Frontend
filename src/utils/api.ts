// central helper for backend requests

// this is the base url for all api calls to the backend
const API_URL = "http://localhost:5000";

// this function takes an endpoint and fetches data from the backend
export async function fetchAPI(endpoint: string) {
    // make the request to the backend using the base url and endpoint
    const response = await fetch(`${API_URL}${endpoint}`);
    return response;
}
