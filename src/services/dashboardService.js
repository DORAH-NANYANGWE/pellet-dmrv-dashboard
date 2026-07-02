import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/dashboard`;

export async function getDashboardSummary() {

    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
    }

    return await response.json();

}