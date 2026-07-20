import { useEffect, useState } from "react";

import { getReportsTable } from "../services/reportsService";

function ReportsTable() {

    const [rows, setRows] = useState([]);

    const [loading, setLoading] = useState(true);

    async function loadTable() {

        try {

            const data = await getReportsTable();

            setRows(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadTable();

    }, []);

    if (loading) {

        return (

            <div
                style={{
                    background: "#1e293b",
                    padding: "25px",
                    borderRadius: "12px",
                    color: "white"
                }}
            >
                Loading report table...
            </div>

        );

    }

    return (

        <div
            style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
            }}
        >

            <h2
                style={{
                    color: "white",
                    marginBottom: "20px"
                }}
            >
                Fleet Telemetry Report
            </h2>

            <div
                style={{
                    overflowX: "auto",
                    maxHeight: "600px",
                    overflowY: "auto"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        color: "white",
                        minWidth: "1100px"
                    }}
                >

                    <thead>

                        <tr
                            style={{
                                background: "#0f172a",
                                position: "sticky",
                                top: 0,
                                zIndex: 1
                            }}
                        >

                            <th style={headerStyle}>Date</th>
                            <th style={headerStyle}>Stove</th>
                            <th style={headerStyle}>Device</th>
                            <th style={headerStyle}>Temperature</th>
                            <th style={headerStyle}>Battery</th>
                            <th style={headerStyle}>Signal</th>
                            <th style={headerStyle}>Fan</th>
                            <th style={headerStyle}>GPS</th>
                            <th style={headerStyle}>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            rows.map((row, index) => (

                                <tr
                                    key={index}
                                    style={{
                                        background:
                                            index % 2 === 0
                                                ? "#1e293b"
                                                : "#273549"
                                    }}
                                >

                                    <td style={cellStyle}>
                                        {row.date}
                                    </td>

                                    <td style={cellStyle}>
                                        {row.stove_code}
                                    </td>

                                    <td style={cellStyle}>
                                        {row.device_code}
                                    </td>

                                    <td
                                        style={{
                                            ...cellStyle,
                                            color: "#22c55e",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {row.temperature} °C
                                    </td>

                                    <td style={cellStyle}>
                                        {row.battery_voltage} V
                                    </td>

                                    <td style={cellStyle}>
                                        {row.signal_strength} dBm
                                    </td>

                                    <td style={cellStyle}>

                                        <span
                                            style={{
                                                background:
                                                    row.fan_running
                                                        ? "#22c55e"
                                                        : "#ef4444",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontWeight: "bold"
                                            }}
                                        >

                                            {row.fan_running ? "ON" : "OFF"}

                                        </span>

                                    </td>

                                    <td style={cellStyle}>

                                        <span
                                            style={{
                                                background:
                                                    row.gps_fix
                                                        ? "#22c55e"
                                                        : "#ef4444",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontWeight: "bold"
                                            }}
                                        >

                                            {row.gps_fix ? "FIX" : "NO FIX"}

                                        </span>

                                    </td>

                                    <td style={cellStyle}>

                                        <span
                                            style={{
                                                background:
                                                    row.status === "Online"
                                                        ? "#22c55e"
                                                        : "#ef4444",
                                                padding: "6px 12px",
                                                borderRadius: "20px",
                                                fontWeight: "bold"
                                            }}
                                        >

                                            {row.status}

                                        </span>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

const headerStyle = {

    padding: "14px",
    textAlign: "left"

};

const cellStyle = {

    padding: "14px",
    borderBottom: "1px solid #334155"

};

export default ReportsTable;