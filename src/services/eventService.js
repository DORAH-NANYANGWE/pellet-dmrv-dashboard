import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/events";

// ======================================
// Get all events
// ======================================
export async function getEvents() {
    const response = await axios.get(API_URL);
    return response.data;
}

// ======================================
// Get events for one device
// ======================================
export async function getDeviceEvents(deviceCode) {
    const response = await axios.get(`${API_URL}/${deviceCode}`);
    return response.data;
}

// ======================================
// Acknowledge an event
// ======================================
export async function acknowledgeEvent(eventId) {
    const response = await axios.put(
        `${API_URL}/${eventId}/acknowledge`
    );

    return response.data;
}