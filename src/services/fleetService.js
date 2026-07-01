const API_URL = "http://127.0.0.1:5000/api/fleet";

export async function getFleet() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to load fleet.");
    }

    return await response.json();

}