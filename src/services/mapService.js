import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/map`;

export async function getMapData() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch map data.");
    }

    return await response.json();

}