import { useNavigate, useParams } from "react-router-dom";

import useStove from "../hooks/useStove";

import TemperatureHistory from "../components/TemperatureHistory";
import GPSMap from "../components/GPSMap";
import EventTimeline from "../components/EventTimeline";

function InfoCard({ title, value, color = "#ffffff" }) {
    return (
        <div
            style={{
                flex: 1,
                minWidth: "220px",
                background: "#1e293b",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
            }}
        >
            <div
                style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginBottom: "10px",
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color,
                    fontSize: "28px",
                    fontWeight: "bold",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function DiagnosticCard({ title, value, status }) {
    const icon =
        status === "good"
            ? "🟢"
            : status === "warning"
            ? "🟡"
            : "🔴";

    return (
        <div
            style={{
                background: "#273549",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
            }}
        >
            <h3
                style={{
                    marginBottom: "15px",
                }}
            >
                {icon} {title}
            </h3>

            <div
                style={{
                    color: "#cbd5e1",
                    fontSize: "18px",
                }}
            >
                {value}
            </div>
        </div>
    );
}

function StoveDetail() {
    const navigate = useNavigate();

    const { deviceCode } = useParams();

    const {
        stove,
        loading,
        error,
        refresh,
    } = useStove(deviceCode);

    if (loading) {
        return (
            <div
                style={{
                    color: "white",
                    padding: "40px",
                }}
            >
                Loading stove data...
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    color: "#ef4444",
                    padding: "40px",
                }}
            >
                Error: {error}
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
                color: "white",
            }}
        >
            <button
                onClick={() => navigate("/fleet")}
                style={{
                    background: "transparent",
                    color: "#60a5fa",
                    border: "none",
                    cursor: "pointer",
                    marginBottom: "20px",
                    fontSize: "15px",
                }}
            >
                ← Back to Fleet
            </button>

            <h1 style={{ marginBottom: "10px" }}>
                🔥 Stove {stove.device_code}
            </h1>

            <p
                style={{
                    color:
                        stove.status === "Online"
                            ? "#22c55e"
                            : "#ef4444",
                    fontWeight: "bold",
                    marginBottom: "30px",
                }}
            >
                ● {stove.status}
            </p>

            {/* Stove Information */}

            <div
                style={{
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "25px",
                    marginBottom: "30px",
                }}
            >
                <h2>Stove Information</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "20px",
                        marginTop: "20px",
                    }}
                >
                    <div>
                        <strong>Customer</strong>
                        <br />
                        {stove.customer_name}
                    </div>

                    <div>
                        <strong>Stove Code</strong>
                        <br />
                        {stove.stove_code}
                    </div>

                    <div>
                        <strong>Serial Number</strong>
                        <br />
                        {stove.serial_number}
                    </div>

                    <div>
                        <strong>Province</strong>
                        <br />
                        {stove.province}
                    </div>

                    <div>
                        <strong>District</strong>
                        <br />
                        {stove.district}
                    </div>
                </div>
            </div>

            {/* Live Metrics */}

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap",
                    marginBottom: "30px",
                }}
            >
                <InfoCard
                    title="Temperature"
                    value={
                        stove.temperature !== null
                            ? `${stove.temperature} °C`
                            : "--"
                    }
                    color="#ef4444"
                />

                <InfoCard
                    title="Battery"
                    value={
                        stove.battery_voltage
                            ? `${stove.battery_voltage} V`
                            : "--"
                    }
                    color="#22c55e"
                />

                <InfoCard
                    title="Fan"
                    value={
                        stove.fan_running
                            ? "Running"
                            : "Stopped"
                    }
                    color="#22c55e"
                />

                <InfoCard
                    title="Signal"
                    value={
                        stove.signal_strength !== null
                            ? `${stove.signal_strength} dBm`
                            : "--"
                    }
                    color="#3b82f6"
                />
            </div>

            {/* GPS */}

            <div
                style={{
                    background: "#1e293b",
                    padding: "25px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                }}
            >
                <h2 style={{ marginBottom: "20px" }}>
                    📍 GPS Location
                </h2>

                <GPSMap
                    latitude={stove.gps_latitude}
                    longitude={stove.gps_longitude}
                    stoveCode={stove.stove_code}
                    status={stove.status}
                    temperature={stove.temperature}
                />
            </div>

            {/* Firmware */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit,minmax(220px,1fr))",
                    gap: "20px",
                    marginBottom: "30px",
                }}
            >
                <InfoCard
                    title="Firmware"
                    value={stove.firmware_version}
                />

                <InfoCard
                    title="Hardware"
                    value={stove.hardware_version}
                />

                <InfoCard
                    title="SD Card"
                    value={
                        stove.sd_card_ok
                            ? "Healthy"
                            : "Fault"
                    }
                />

                <InfoCard
                    title="Last Seen"
                    value={
                        stove.last_seen
                            ? stove.last_seen
                            : "--"
                    }
                />
            </div>

            {/* Event Timeline */}

            <EventTimeline
                deviceCode={stove.device_code}
            />

            {/* Temperature History */}

            <TemperatureHistory
                deviceCode={deviceCode}
            />

            {/* Diagnostics */}

            <div
                style={{
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "30px",
                    marginTop: "30px",
                    marginBottom: "30px",
                }}
            >
                <h2 style={{ marginBottom: "25px" }}>
                    🩺 System Diagnostics
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                    }}
                >
                    <DiagnosticCard
                        title="Device Status"
                        value={stove.status}
                        status={
                            stove.status === "Online"
                                ? "good"
                                : "bad"
                        }
                    />

                    <DiagnosticCard
                        title="Fan"
                        value={
                            stove.fan_running
                                ? "Running"
                                : "Stopped"
                        }
                        status={
                            stove.fan_running
                                ? "good"
                                : "bad"
                        }
                    />

                    <DiagnosticCard
                        title="GPS"
                        value={
                            stove.gps_fix
                                ? "GPS Fix"
                                : "No GPS Fix"
                        }
                        status={
                            stove.gps_fix
                                ? "good"
                                : "bad"
                        }
                    />

                    <DiagnosticCard
                        title="SD Card"
                        value={
                            stove.sd_card_ok
                                ? "Healthy"
                                : "Fault"
                        }
                        status={
                            stove.sd_card_ok
                                ? "good"
                                : "bad"
                        }
                    />

                    <DiagnosticCard
                        title="Battery"
                        value={
                            stove.battery_voltage
                                ? `${stove.battery_voltage} V`
                                : "Unknown"
                        }
                        status={
                            (stove.battery_voltage ?? 0) >= 3.6
                                ? "good"
                                : "warning"
                        }
                    />

                    <DiagnosticCard
                        title="Signal"
                        value={
                            stove.signal_strength !== null
                                ? `${stove.signal_strength} dBm`
                                : "No Data"
                        }
                        status={
                            (stove.signal_strength ?? -999) > -90
                                ? "good"
                                : "warning"
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default StoveDetail;