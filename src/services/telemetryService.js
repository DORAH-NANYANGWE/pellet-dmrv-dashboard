import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/telemetry/chart`;

export async function getTemperatureChart() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch chart data.");
    }

    return await response.json();

}