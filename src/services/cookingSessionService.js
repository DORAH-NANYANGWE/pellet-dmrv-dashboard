const API_URL = "http://127.0.0.1:5000/api";

export async function getCookingSessions() {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/cooking-sessions`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch cooking sessions.");
    }

    return response.json();
}