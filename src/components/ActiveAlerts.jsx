import { useEffect, useState } from "react";
import { getFleet } from "../services/fleetService";

function ActiveAlerts() {

    const [alerts, setAlerts] = useState([]);

    useEffect(() => {

        loadAlerts();

        const interval = setInterval(loadAlerts, 30000);

        return () => clearInterval(interval);

    }, []);

    async function loadAlerts() {

        try {

            const fleet = await getFleet();

            const activeAlerts = [];

            fleet.forEach((stove) => {

                // ==========================
                // DEVICE OFFLINE
                // ==========================
                if (stove.status === "Offline") {

                    activeAlerts.push({
                        severity: "critical",
                        stove: stove.device_code,
                        message: "Device Offline",
                    });

                    // Skip the rest since the device is offline
                    return;
                }

                // ==========================
                // LOW BATTERY
                // ==========================
                if (
                    stove.battery_voltage !== null &&
                    stove.battery_voltage < 3.5
                ) {

                    activeAlerts.push({
                        severity: "warning",
                        stove: stove.device_code,
                        message: `Low Battery (${stove.battery_voltage}V)`,
                    });

                }

                // ==========================
                // GPS LOST
                // ==========================
                if (stove.gps_fix === false) {

                    activeAlerts.push({
                        severity: "warning",
                        stove: stove.device_code,
                        message: "GPS Lost",
                    });

                }

                // ==========================
                // FAN FAILURE
                // Only if cooking is active
                // ==========================
                if (
                    stove.temperature >= 150 &&
                    stove.fan_running === false
                ) {

                    activeAlerts.push({
                        severity: "critical",
                        stove: stove.device_code,
                        message: "Fan Failure During Cooking",
                    });

                }

                // ==========================
                // EXTREME TEMPERATURE
                // ==========================
                if (
                    stove.temperature >= 350
                ) {

                    activeAlerts.push({
                        severity: "critical",
                        stove: stove.device_code,
                        message: `Extreme Temperature (${stove.temperature}°C)`,
                    });

                }

            });

            setAlerts(activeAlerts);

        } catch (error) {

            console.error(error);

        }

    }

    return (

        <div
            style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "12px",
                marginTop: "30px",
            }}
        >

            <h2 style={{ marginBottom: "20px" }}>
                🚨 Active Alerts
            </h2>

            {alerts.length === 0 ? (

                <p
                    style={{
                        color: "#22c55e",
                        fontWeight: "bold",
                    }}
                >
                    ✅ No active alerts
                </p>

            ) : (

                alerts.map((alert, index) => (

                    <div
                        key={index}
                        style={{
                            background:
                                alert.severity === "critical"
                                    ? "#991b1b"
                                    : "#92400e",

                            padding: "18px",
                            marginBottom: "15px",
                            borderRadius: "12px",
                            textAlign: "center",
                        }}
                    >

                        <h3
                            style={{
                                margin: 0,
                                color: "white",
                            }}
                        >
                            {alert.stove}
                        </h3>

                        <p
                            style={{
                                marginTop: "10px",
                                marginBottom: 0,
                                color: "white",
                                fontSize: "18px",
                            }}
                        >
                            {alert.message}
                        </p>

                    </div>

                ))

            )}

        </div>

    );

}

export default ActiveAlerts;