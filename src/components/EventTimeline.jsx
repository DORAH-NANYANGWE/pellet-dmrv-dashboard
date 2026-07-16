import { useEffect, useState } from "react";
import {
    getDeviceEvents,
    acknowledgeEvent
} from "../services/eventService";

function EventTimeline({ deviceCode }) {

    const [events, setEvents] = useState([]);

    async function loadEvents() {

        try {

            const data = await getDeviceEvents(deviceCode);

            setEvents(data);

        } catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        if (deviceCode) {
            loadEvents();
        }

    }, [deviceCode]);

    async function handleAcknowledge(eventId) {

        try {

            await acknowledgeEvent(eventId);

            loadEvents();

        } catch (error) {

            console.error(error);

        }

    }

    function getColor(severity) {

        switch (severity) {

            case "critical":
                return "#dc2626";

            case "warning":
                return "#d97706";

            default:
                return "#2563eb";

        }

    }

    const activeEvents = events.filter(
        (event) => !event.acknowledged
    );

    const historyEvents = events.filter(
        (event) => event.acknowledged
    );

    return (

        <div
            style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "12px",
                marginTop: "30px",
            }}
        >

            {/* Active Alerts */}

            <h2
                style={{
                    marginBottom: "20px",
                    color: "white"
                }}
            >
                🚨 Active Alerts
            </h2>

            {activeEvents.length === 0 ? (

                <p style={{ color: "#94a3b8" }}>
                    No active alerts.
                </p>

            ) : (

                activeEvents.map((event) => (

                    <div
                        key={event.id}
                        style={{
                            borderLeft: `6px solid ${getColor(event.severity)}`,
                            background: "#0f172a",
                            padding: "18px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            textAlign: "center"
                        }}
                    >

                        <h3
                            style={{
                                margin: 0,
                                color: "white"
                            }}
                        >
                            {event.message}
                        </h3>

                        <p
                            style={{
                                color: "#94a3b8",
                                marginTop: "8px"
                            }}
                        >
                            {event.event_type}
                        </p>

                        <small
                            style={{
                                color: "#64748b",
                                display: "block",
                                marginBottom: "15px"
                            }}
                        >
                            {event.event_time}
                        </small>

                        <button
                            onClick={() => handleAcknowledge(event.id)}
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "10px 18px",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: "bold"
                            }}
                        >
                            Acknowledge
                        </button>

                    </div>

                ))

            )}

            {/* Event History */}

            <h2
                style={{
                    marginTop: "40px",
                    marginBottom: "20px",
                    color: "white"
                }}
            >
                📚 Event History
            </h2>

            {historyEvents.length === 0 ? (

                <p style={{ color: "#94a3b8" }}>
                    No historical events.
                </p>

            ) : (

                historyEvents.map((event) => (

                    <div
                        key={event.id}
                        style={{
                            borderLeft: "6px solid #16a34a",
                            background: "#0f172a",
                            padding: "18px",
                            marginBottom: "15px",
                            borderRadius: "8px",
                            textAlign: "center"
                        }}
                    >

                        <h3
                            style={{
                                margin: 0,
                                color: "white"
                            }}
                        >
                            {event.message}
                        </h3>

                        <p
                            style={{
                                color: "#94a3b8",
                                marginTop: "8px"
                            }}
                        >
                            {event.event_type}
                        </p>

                        <small
                            style={{
                                color: "#64748b",
                                display: "block",
                                marginBottom: "15px"
                            }}
                        >
                            {event.event_time}
                        </small>

                        <span
                            style={{
                                background: "#16a34a",
                                color: "white",
                                padding: "8px 16px",
                                borderRadius: "8px",
                                fontWeight: "bold"
                            }}
                        >
                            ✓ Acknowledged
                        </span>

                    </div>

                ))

            )}

        </div>

    );

}

export default EventTimeline;