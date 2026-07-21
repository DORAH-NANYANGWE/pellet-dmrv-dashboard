import { useEffect, useMemo, useState } from "react";

function CookingSessionsTable() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    async function loadSessions() {

        try {

            const response = await fetch(
                "http://127.0.0.1:5000/api/cooking-sessions"
            );

            const data = await response.json();

            setSessions(data.items ?? []);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSessions();

        const interval = setInterval(
            loadSessions,
            30000
        );

        return () => clearInterval(interval);

    }, []);

    const filteredSessions = useMemo(() => {

        return sessions.filter(session => {

            const matchesSearch =

                session.device_code
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesStatus =

                statusFilter === "All"

                ||

                session.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [

        sessions,
        search,
        statusFilter

    ]);

    function exportCSV() {

        const headers = [

            "Device",
            "Status",
            "Start Time",
            "End Time",
            "Duration",
            "Peak Temperature",
            "Average Temperature",
            "Fuel Used",
            "CO2 Saved"

        ];

        const rows = filteredSessions.map(session => [

            session.device_code,
            session.status,
            session.start_time,
            session.end_time,
            session.duration_minutes,
            session.peak_temperature,
            session.average_temperature,
            session.estimated_fuel_used,
            session.estimated_co2_saved

        ]);

        const csv = [

            headers,
            ...rows

        ]
        .map(row => row.join(","))
        .join("\n");

        const blob = new Blob([csv], {

            type: "text/csv"

        });

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;

        link.download = "cooking_sessions.csv";

        link.click();

    }

    const totalSessions = sessions.length;

    const activeSessions = sessions.filter(

        s => !s.end_time

    ).length;

    const completedSessions =

        totalSessions - activeSessions;

    const averageDuration = totalSessions

        ?

        (

            sessions.reduce(

                (sum, s) =>

                    sum +

                    (s.duration_minutes || 0),

                0

            )

            /

            totalSessions

        ).toFixed(1)

        :

        "--";

    if (loading) {

        return (

            <p style={{ color: "white" }}>

                Loading cooking sessions...

            </p>

        );

    }

    return (

        <div>

            <h2
                style={{
                    color: "white",
                    marginBottom: "25px"
                }}
            >

                Cooking Sessions

            </h2>

            <div
                style={{

                    display: "grid",

                    gridTemplateColumns:
                        "repeat(4,1fr)",

                    gap: "20px",

                    marginBottom: "25px"

                }}
            >

                <StatCard
                    title="Total Sessions"
                    value={totalSessions}
                    color="#2563eb"
                />

                <StatCard
                    title="Active"
                    value={activeSessions}
                    color="#22c55e"
                />

                <StatCard
                    title="Completed"
                    value={completedSessions}
                    color="#f59e0b"
                />

                <StatCard
                    title="Avg Duration"
                    value={`${averageDuration} min`}
                    color="#8b5cf6"
                />

            </div>

            <div
                style={{

                    display: "flex",

                    gap: "15px",

                    marginBottom: "20px"

                }}
            >

                <input

                    value={search}

                    onChange={(e)=>

                        setSearch(
                            e.target.value
                        )

                    }

                    placeholder="Search device..."

                    style={{

                        padding:"10px",

                        width:"250px"

                    }}

                />

                <select

                    value={statusFilter}

                    onChange={(e)=>

                        setStatusFilter(
                            e.target.value
                        )

                    }

                    style={{

                        padding:"10px"

                    }}

                >

                    <option>All</option>

                    <option>Completed</option>

                    <option>Active</option>

                </select>

                <button
                    onClick={loadSessions}
                >

                    Refresh

                </button>

                <button
                    onClick={exportCSV}
                >

                    Export CSV

                </button>

            </div>
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

                        <th style={{ padding: "14px" }}>Device</th>

                        <th style={{ padding: "14px" }}>Status</th>

                        <th style={{ padding: "14px" }}>Start Time</th>

                        <th style={{ padding: "14px" }}>End Time</th>

                        <th style={{ padding: "14px" }}>Duration</th>

                        <th style={{ padding: "14px" }}>Peak Temp</th>

                        <th style={{ padding: "14px" }}>Average Temp</th>

                        <th style={{ padding: "14px" }}>Fuel Used</th>

                        <th style={{ padding: "14px" }}>CO₂ Saved</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        filteredSessions.map((session, index) => {

                            const peakColor =

                                session.peak_temperature >= 250

                                    ? "#ef4444"

                                    : session.peak_temperature >= 180

                                    ? "#f59e0b"

                                    : "#22c55e";

                            return (

                                <tr

                                    key={session.id}

                                    style={{

                                        background:

                                            index % 2 === 0

                                                ? "#1e293b"

                                                : "#273549"

                                    }}

                                >

                                    <td
                                        style={{
                                            padding: "14px",
                                            fontWeight: "bold"
                                        }}
                                    >

                                        {session.device_code}

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        <span

                                            style={{

                                                background:

                                                    session.status === "Completed"

                                                        ? "#22c55e"

                                                        : "#f59e0b",

                                                padding: "6px 14px",

                                                borderRadius: "20px",

                                                fontWeight: "bold"

                                            }}

                                        >

                                            {session.status}

                                        </span>

                                    </td>

                                    <td style={{ textAlign: "center" }}>

                                        {session.start_time ?? "--"}

                                    </td>

                                    <td style={{ textAlign: "center" }}>

                                        {session.end_time ?? "--"}

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {session.duration_minutes ?? "--"} min

                                    </td>

                                    <td

                                        style={{

                                            textAlign: "center",

                                            color: peakColor,

                                            fontWeight: "bold"

                                        }}

                                    >

                                        {session.peak_temperature ?? "--"} °C

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {session.average_temperature ?? "--"} °C

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {session.estimated_fuel_used ?? "--"} kg

                                    </td>

                                    <td
                                        style={{
                                            textAlign: "center"
                                        }}
                                    >

                                        {session.estimated_co2_saved ?? "--"} kg

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

function StatCard({

    title,

    value,

    color

}) {

    return (

        <div

            style={{

                background: "#1e293b",

                borderLeft: `6px solid ${color}`,

                borderRadius: "10px",

                padding: "20px"

            }}

        >

            <div

                style={{

                    color: "#94a3b8",

                    fontSize: "13px"

                }}

            >

                {title}

            </div>

            <div

                style={{

                    marginTop: "10px",

                    fontSize: "26px",

                    fontWeight: "bold",

                    color

                }}

            >

                {value}

            </div>

        </div>

    );

}

export default CookingSessionsTable;