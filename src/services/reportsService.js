import API_BASE_URL from "./api";

const SUMMARY_URL = `${API_BASE_URL}/api/reports/summary`;
const TEMPERATURE_URL = `${API_BASE_URL}/api/reports/temperature`;
const TABLE_URL = `${API_BASE_URL}/api/reports/table`;

export async function getReportsSummary() {

    const response = await fetch(SUMMARY_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch reports summary");
    }

    return await response.json();

}

export async function getTemperatureReport() {

    const response = await fetch(TEMPERATURE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch temperature report");
    }

    return await response.json();

}

export async function getReportsTable() {

    const response = await fetch(TABLE_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch reports table");
    }

    return await response.json();

}