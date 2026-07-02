import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/fleet`;

export async function getFleet() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to load fleet.");
    }

    return await response.json();

}