import API_BASE_URL from "./api";

const API_URL = `${API_BASE_URL}/api/fleet`;

export async function getFleet() {

    const token = localStorage.getItem("access_token");

    const response = await fetch(API_URL, {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message || "Failed to load fleet.");

    }

    return data;

}

export async function getStove(deviceCode) {

    const token = localStorage.getItem("access_token");

    const response = await fetch(

        `${API_URL}/${deviceCode}`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message || "Failed to load stove.");

    }

    return data;

}
export async function getTemperatureHistory(deviceCode) {

    const token = localStorage.getItem("access_token");

    const response = await fetch(

        `${API_URL}/${deviceCode}/history`,

        {

            headers: {

                Authorization: `Bearer ${token}`

            }

        }

    );

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.message || "Failed to load history.");

    }

    return data;

}