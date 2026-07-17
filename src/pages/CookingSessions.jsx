import { useEffect, useMemo, useState } from "react";
import {
    FaFire,
    FaClock,
    FaThermometerHalf,
    FaHistory,
    FaChartBar
} from "react-icons/fa";

import { getCookingSessions } from "../services/cookingSessionService";

function CookingSessions() {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadSessions() {

        try {

            const data = await getCookingSessions();

            setSessions(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSessions();

        const interval = setInterval(loadSessions, 30000);

        return () => clearInterval(interval);

    }, []);

    const activeSession = sessions.find(
        session => session.end_time === null
    );

    const completedSessions = sessions.filter(
        session => session.end_time !== null
    );

    const totalSessions = sessions.length;

    const activeCount = activeSession ? 1 : 0;

    const highestTemp = useMemo(() => {

        if (sessions.length === 0) return 0;

        return Math.max(
            ...sessions.map(s => s.peak_temperature || 0)
        );

    }, [sessions]);

    const averageDuration = useMemo(() => {

        const completed = completedSessions.filter(
            s => s.duration_minutes !== null
        );

        if (completed.length === 0)
            return 0;

        const total = completed.reduce(

            (sum, session) =>

                sum + session.duration_minutes,

            0

        );

        return Math.round(total / completed.length);

    }, [completedSessions]);

    function formatDate(date) {

        if (!date)
            return "--";

        return new Date(date).toLocaleString(
            [],
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }

    if (loading) {

        return (

            <div
                style={{
                    color: "white",
                    padding: "40px"
                }}
            >
                Loading Cooking Sessions...
            </div>

        );

    }

    return (

        <div
            style={{
                padding: "35px",
                color: "white"
            }}
        >

            <h1
                style={{
                    fontSize: "46px",
                    fontWeight: "700",
                    marginBottom: "30px"
                }}
            >
                🔥 Cooking Sessions
            </h1>

            {/* KPI CARDS */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(4,1fr)",
                    gap: "20px",
                    marginBottom: "35px"
                }}
            >

                <KpiCard
                    icon={<FaFire />}
                    title="Total Sessions"
                    value={totalSessions}
                    color="#ea580c"
                />

                <KpiCard
                    icon={<FaChartBar />}
                    title="Active Cooking"
                    value={activeCount}
                    color="#22c55e"
                />

                <KpiCard
                    icon={<FaClock />}
                    title="Avg Duration"
                    value={`${averageDuration} min`}
                    color="#3b82f6"
                />

                <KpiCard
                    icon={<FaThermometerHalf />}
                    title="Highest Temp"
                    value={`${highestTemp}°C`}
                    color="#ef4444"
                />

            </div>
                        {/* CURRENT COOKING */}

            <div
                style={{
                    background: "#1e293b",
                    borderRadius: "16px",
                    padding: "30px",
                    marginBottom: "35px",
                    border: "1px solid #334155"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px"
                    }}
                >

                    <h2
                        style={{
                            margin: 0,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}
                    >
                        <FaFire color="#f97316" />

                        Current Cooking
                    </h2>

                    {activeSession && (

                        <span
                            style={{
                                background: "#15803d",
                                padding: "8px 18px",
                                borderRadius: "30px",
                                fontWeight: "600"
                            }}
                        >
                            ● ACTIVE
                        </span>

                    )}

                </div>

                {!activeSession ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "40px",
                            color: "#94a3b8"
                        }}
                    >
                        No stove is currently cooking.
                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "30px"
                        }}
                    >

                        <div>

                            <h1
                                style={{
                                    marginTop: 0,
                                    marginBottom: "25px",
                                    fontSize: "42px"
                                }}
                            >
                                {activeSession.device_code}
                            </h1>

                            <InfoRow
                                label="Started"
                                value={formatDate(
                                    activeSession.start_time
                                )}
                            />

                            <InfoRow
                                label="Peak Temperature"
                                value={`${activeSession.peak_temperature}°C`}
                            />

                            <InfoRow
                                label="Average Temperature"
                                value={`${activeSession.average_temperature.toFixed(1)}°C`}
                            />

                            <InfoRow
                                label="Status"
                                value="Cooking"
                            />

                        </div>

                        <div>

                            <div
                                style={{
                                    background: "#0f172a",
                                    padding: "25px",
                                    borderRadius: "14px"
                                }}
                            >

                                <h3
                                    style={{
                                        marginTop: 0
                                    }}
                                >
                                    Live Session
                                </h3>

                                <div
                                    style={{
                                        height: "16px",
                                        background: "#334155",
                                        borderRadius: "30px",
                                        overflow: "hidden",
                                        marginTop: "20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            background:
                                                "linear-gradient(to right,#22c55e,#16a34a)"
                                        }}
                                    />

                                </div>

                                <p
                                    style={{
                                        color: "#94a3b8",
                                        marginTop: "15px",
                                        marginBottom: 0
                                    }}
                                >
                                    Session currently in progress...
                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </div>

            {/* COOKING HISTORY */}

            <div>

                <h2
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "20px"
                    }}
                >

                    <FaHistory />

                    Cooking History

                </h2>

                {completedSessions.length === 0 ? (

                    <p>No completed sessions.</p>

                ) : (

                    completedSessions.map(session => (

                        <div
                            key={session.id}
                            style={{
                                background: "#1e293b",
                                borderRadius: "14px",
                                padding: "22px",
                                marginBottom: "20px",
                                borderLeft:
                                    "6px solid #2563eb",
                                transition: "0.3s"
                            }}
                            onMouseEnter={(e) =>
                                e.currentTarget.style.transform =
                                    "translateY(-3px)"
                            }
                            onMouseLeave={(e) =>
                                e.currentTarget.style.transform =
                                    "translateY(0px)"
                            }
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems: "center",
                                    marginBottom: "15px"
                                }}
                            >

                                <h3
                                    style={{
                                        margin: 0,
                                        fontSize: "28px"
                                    }}
                                >
                                    {session.device_code}
                                </h3>

                                <span
                                    style={{
                                        background: "#2563eb",
                                        padding: "6px 16px",
                                        borderRadius: "25px"
                                    }}
                                >
                                    ✔ Completed
                                </span>

                            </div>

                            <InfoRow
                                label="Started"
                                value={formatDate(
                                    session.start_time
                                )}
                            />

                            <InfoRow
                                label="Ended"
                                value={formatDate(
                                    session.end_time
                                )}
                            />

                            <InfoRow
                                label="Duration"
                                value={`${session.duration_minutes} minutes`}
                            />

                            <InfoRow
                                label="Peak Temperature"
                                value={`${session.peak_temperature}°C`}
                            />

                            <InfoRow
                                label="Average Temperature"
                                value={`${session.average_temperature.toFixed(1)}°C`}
                            />

                        </div>

                    ))

                )}

            </div>
                    </div>

    );

}

/* ======================================
   KPI CARD
====================================== */

function KpiCard({

    icon,
    title,
    value,
    color

}) {

    return (

        <div
            style={{
                background: "#1e293b",
                borderRadius: "14px",
                padding: "25px",
                borderLeft: `6px solid ${color}`,
                transition: "0.3s"
            }}
        >

            <div
                style={{
                    color: color,
                    fontSize: "28px",
                    marginBottom: "15px"
                }}
            >
                {icon}
            </div>

            <p
                style={{
                    color: "#94a3b8",
                    margin: 0,
                    fontSize: "15px"
                }}
            >
                {title}
            </p>

            <h1
                style={{
                    marginTop: "10px",
                    marginBottom: 0,
                    fontSize: "36px",
                    fontWeight: "700"
                }}
            >
                {value}
            </h1>

        </div>

    );

}

/* ======================================
   INFO ROW
====================================== */

function InfoRow({

    label,
    value

}) {

    return (

        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid #334155"
            }}
        >

            <span
                style={{
                    color: "#94a3b8",
                    fontWeight: "500"
                }}
            >
                {label}
            </span>

            <span
                style={{
                    fontWeight: "600",
                    textAlign: "right"
                }}
            >
                {value}
            </span>

        </div>

    );

}

export default CookingSessions;