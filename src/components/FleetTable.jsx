import { useEffect, useState } from "react";
import { getFleet } from "../services/fleetService";

function FleetTable() {

    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadFleet() {

        try {

            const data = await getFleet();

            setFleet(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadFleet();

        const interval = setInterval(loadFleet, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return (
            <p style={{ color: "white" }}>
                Loading fleet...
            </p>
        );

    }

    return (

        <div>

            <h2
                style={{
                    marginBottom: "20px",
                    color: "#ffffff"
                }}
            >
                Fleet Status
            </h2>

            <table
                style={{
                    width: "100%",
                    color: "white",
                    borderCollapse: "collapse",
                    fontSize: "14px"
                }}
            >

                <thead>

                    <tr
                        style={{
                            background: "#0f172a",
                            borderBottom: "2px solid #334155"
                        }}
                    >

                        <th style={{ padding: "14px", textAlign: "left" }}>Stove</th>

                        <th style={{ padding: "14px", textAlign: "left" }}>Device</th>

                        <th style={{ padding: "14px", textAlign: "center" }}>Status</th>

                        <th style={{ padding: "14px", textAlign: "center" }}>Temperature</th>

                        <th style={{ padding: "14px", textAlign: "center" }}>Battery</th>

                        <th style={{ padding: "14px", textAlign: "center" }}>Last Seen</th>

                    </tr>

                </thead>

                <tbody>

                    {fleet.map((device, index) => (

                        <tr

                            key={device.device_code}

                            style={{
                                background:
                                    index % 2 === 0
                                        ? "#1e293b"
                                        : "#273549",

                                transition: "0.3s"
                            }}

                        >

                            <td style={{ padding: "14px" }}>

                                <strong>{device.stove_id}</strong>

                            </td>

                            <td style={{ padding: "14px" }}>

                                {device.device_code}

                            </td>

                            <td
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                <span
                                    style={{
                                        background:
                                            device.status === "Online"
                                                ? "#16a34a"
                                                : "#dc2626",

                                        color: "white",

                                        padding: "6px 12px",

                                        borderRadius: "30px",

                                        fontSize: "12px",

                                        fontWeight: "bold"
                                    }}
                                >

                                    {device.status === "Online"
                                        ? "🟢 ONLINE"
                                        : "🔴 OFFLINE"}

                                </span>

                            </td>

                            <td
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                {device.temperature ?? "--"} °C

                            </td>

                            <td
                                style={{
                                    textAlign: "center"
                                }}
                            >

                                {device.battery_voltage ?? "--"} V

                            </td>

                            <td
                                style={{
                                    textAlign: "center",
                                    fontSize: "12px",
                                    color: "#cbd5e1"
                                }}
                            >

                                {device.last_seen ?? "--"}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default FleetTable;