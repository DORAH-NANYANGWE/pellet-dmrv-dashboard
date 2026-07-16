import { useEffect, useMemo, useState } from "react";
import { getFleet } from "../services/fleetService";

import FleetStats from "./FleetStats";
import FleetToolbar from "./FleetToolbar";
import { useNavigate } from "react-router-dom";
import FleetMap from "./FleetMap";

function FleetTable() {

    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");
    const navigate = useNavigate();
    

    async function loadFleet() {

        try {

            const data = await getFleet();

            setFleet(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadFleet();

        const interval = setInterval(loadFleet, 30000);

        return () => clearInterval(interval);

    }, []);

    function batteryPercent(voltage) {

        if (!voltage) return "--";

        return Math.round(

            Math.min(
                100,

                Math.max(
                    0,

                    ((voltage - 3.2) / (4.2 - 3.2)) * 100

                )

            )

        );

    }

    const filteredFleet = useMemo(() => {

        return fleet.filter(device => {

            const matchesSearch =

                device.stove_id
                    ?.toString()
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                device.device_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =

                statusFilter === "All"

                ||

                device.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [fleet, search, statusFilter]);

    const total = fleet.length;

    const online = fleet.filter(

        d => d.status === "Online"

    ).length;

    const offline = total - online;

    const validTemps = fleet.filter(

        d => d.temperature !== null &&
            d.temperature !== undefined

    );

    const averageTemperature =

        validTemps.length

            ? (

                validTemps.reduce(

                    (sum, d) => sum + d.temperature,

                    0

                ) / validTemps.length

            ).toFixed(1)

            : "--";

    const lowBattery = fleet.filter(

        d => d.battery_voltage &&
             d.battery_voltage < 3.5

    ).length;

    const alerts = offline + lowBattery;

    if (loading) {

        return (

            <p
                style={{
                    color: "white"
                }}
            >

                Loading fleet...

            </p>

        );

    }
    function exportCSV() {

    const headers = [

        "Stove",

        "Device",

        "Status",

        "Temperature",

        "Battery",

        "Last Seen"

    ];

    const rows = filteredFleet.map(device => [

        device.stove_id,

        device.device_code,

        device.status,

        device.temperature,

        device.battery_voltage,

        device.last_seen

    ]);

    const csv = [

        headers,

        ...rows

    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csv], {

        type:"text/csv"

    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "fleet_report.csv";

    link.click();

}

    return (

        <div>

            <h2
                style={{
                    color: "white",
                    marginBottom: "25px"
                }}
            >

                Fleet Status

            </h2>

            <FleetStats

                total={total}

                online={online}

                offline={offline}

                averageTemperature={averageTemperature}

                lowBattery={lowBattery}

                alerts={alerts}

            />

            <FleetToolbar

    search={search}

    setSearch={setSearch}

    statusFilter={statusFilter}

    setStatusFilter={setStatusFilter}

    refresh={loadFleet}

    exportCSV={exportCSV}

    totalRows={filteredFleet.length}

/>
<h2
    style={{
        marginTop: "30px",
        marginBottom: "20px",
        color: "white",
    }}
>
    🗺 Fleet Map
</h2>

<FleetMap
    stoves={filteredFleet}
/>

            <table

                style={{

                    width: "100%",

                    borderCollapse: "collapse",

                    color: "white",

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

                        <th style={{ padding: "14px" }}>Stove</th>

                        <th style={{ padding: "14px" }}>Device</th>

                        <th style={{ padding: "14px" }}>Status</th>

                        <th style={{ padding: "14px" }}>Temperature</th>

                        <th style={{ padding: "14px" }}>Battery</th>

                        <th style={{ padding: "14px" }}>Last Seen</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredFleet.map((device, index) => {

                            const tempColor =

                                device.temperature > 80

                                    ? "#ef4444"

                                    : device.temperature > 60

                                    ? "#f59e0b"

                                    : "#22c55e";

                            return (

                                <tr
    key={device.device_code}

    onClick={() => navigate(`/fleet/${device.device_code}`)}

    style={{

        background:
            device.status === "Offline"
                ? "#3b1111"
                : index % 2 === 0
                ? "#1e293b"
                : "#273549",

        cursor: "pointer",
        transition: "0.2s"

    }}

    onMouseEnter={(e) => {
        e.currentTarget.style.filter = "brightness(115%)";
    }}

    onMouseLeave={(e) => {
        e.currentTarget.style.filter = "brightness(100%)";
    }}



                                >

                                    <td
                                        style={{
                                            padding: "14px",
                                            fontWeight: "bold"
                                        }}
                                    >

                                        {device.stove_id}

                                    </td>

                                    <td>{device.device_code}</td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        <span

                                            style={{

                                                background:

                                                    device.status === "Online"

                                                        ? "#22c55e"

                                                        : "#ef4444",

                                                padding: "6px 14px",

                                                borderRadius: "20px",

                                                fontWeight: "bold"

                                            }}

                                        >

                                            {device.status}

                                        </span>

                                    </td>

                                    <td

                                        style={{

                                            textAlign: "center",

                                            color: tempColor,

                                            fontWeight: "bold"

                                        }}

                                    >

                                        {

                                            device.temperature ??

                                            "--"

                                        }

                                        °C

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {

                                            device.battery_voltage

                                                ?

                                                <>

                                                    🔋 {batteryPercent(device.battery_voltage)}%

                                                    <div
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#94a3b8"
                                                        }}
                                                    >

                                                        {device.battery_voltage} V

                                                    </div>

                                                </>

                                                :

                                                <span
                                                    style={{
                                                        color: "#94a3b8"
                                                    }}
                                                >

                                                    N/A

                                                </span>

                                        }

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {device.last_seen ?? "--"}

                                    </td>

                                </tr>

                            );

                        })

                    }

                </tbody>

            </table>

        </div>

    );

}

export default FleetTable;