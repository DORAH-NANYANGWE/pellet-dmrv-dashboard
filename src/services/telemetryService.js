const API_URL = "http://127.0.0.1:5000/api/telemetry/chart";

export async function getTemperatureChart() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch chart data.");
    }

    return await response.json();

}