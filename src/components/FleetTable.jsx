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

        const interval = setInterval(() => {

            loadFleet();

        }, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return <p style={{ color: "white" }}>Loading fleet...</p>;

    }

    return (

        <div>

            <h2>Fleet Status</h2>

            <table
                style={{
                    width: "100%",
                    color: "white",
                    borderCollapse: "collapse",
                    fontSize: "14px"
                }}
            >

                <thead>

                    <tr style={{ borderBottom: "1px solid #334155" }}>

                        <th style={{ padding: "10px", textAlign: "left" }}>Stove</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Device</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Temp</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Battery</th>
                        <th style={{ padding: "10px", textAlign: "left" }}>Last Seen</th>

                    </tr>

                </thead>

                <tbody>

                    {fleet.map((device) => (

                        <tr key={device.device_code}>

                            <td style={{ padding: "8px" }}>
                                {device.stove_id}
                            </td>

                            <td style={{ padding: "8px" }}>
                                {device.device_code}
                            </td>

                            <td style={{ padding: "8px" }}>
                                {device.status === "Online"
                                    ? "🟢 Online"
                                    : "🔴 Offline"}
                            </td>

                            <td style={{ padding: "8px" }}>
                                {device.temperature ?? "--"} °C
                            </td>

                            <td style={{ padding: "8px" }}>
                                {device.battery_voltage ?? "--"} V
                            </td>

                            <td style={{ padding: "8px" }}>
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