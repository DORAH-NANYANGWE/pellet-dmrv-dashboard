const API_URL = "http://127.0.0.1:5000/api/dashboard";

export async function getDashboardSummary() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    return await response.json();
}