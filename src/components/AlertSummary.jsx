import { useEffect, useState } from "react";
import { getEvents } from "../services/eventService";

function AlertSummary() {
    const [summary, setSummary] = useState({
        critical: 0,
        warning: 0,
        total: 0,
    });

    useEffect(() => {
        async function loadAlerts() {
            try {
                const events = await getEvents();

                const critical = events.filter(
                    (event) => event.severity === "critical"
                ).length;

                const warning = events.filter(
                    (event) => event.severity === "warning"
                ).length;

                setSummary({
                    critical,
                    warning,
                    total: critical + warning,
                });

            } catch (error) {
                console.error(error);
            }
        }

        loadAlerts();
    }, []);

    return (
        <div
            style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "25px",
                marginTop: "30px",
            }}
        >
            <h2 style={{ marginBottom: "20px" }}>
                🚨 Fleet Alert Summary
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3,1fr)",
                    gap: "20px",
                }}
            >
                <div
                    style={{
                        background: "#7f1d1d",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <h3>Critical</h3>
                    <h1>{summary.critical}</h1>
                </div>

                <div
                    style={{
                        background: "#92400e",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <h3>Warning</h3>
                    <h1>{summary.warning}</h1>
                </div>

                <div
                    style={{
                        background: "#1d4ed8",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                    }}
                >
                    <h3>Total</h3>
                    <h1>{summary.total}</h1>
                </div>
            </div>
        </div>
    );
}

export default AlertSummary;