const API_URL = "http://127.0.0.1:5000/api/map";

export async function getMapData() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch map data.");
    }

    return await response.json();

}