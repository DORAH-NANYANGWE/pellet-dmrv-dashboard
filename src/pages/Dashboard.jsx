import { useEffect, useState } from "react";
import ActiveAlerts from "../components/ActiveAlerts";
import TemperatureChart from "../components/TemperatureChart";
import AlertSummary from "../components/AlertSummary";

import {
    FaUsers,
    FaFire,
    FaBroadcastTower,
    FaChartLine
} from "react-icons/fa";

import { getDashboardSummary } from "../services/dashboardService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadDashboard() {

        try {

            const data = await getDashboardSummary();

            setDashboard(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadDashboard();

        const interval = setInterval(loadDashboard, 30000);

        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return (
            <div style={{ color: "white", padding: "30px" }}>
                Loading Dashboard...
            </div>
        );

    }

    const cards = [

        {
            title: "Total Users",
            value: dashboard.total_users,
            icon: <FaUsers size={32} />,
            color: "#2563eb"
        },

        {
            title: "Total Stoves",
            value: dashboard.total_stoves,
            icon: <FaFire size={32} />,
            color: "#ea580c"
        },

        {
            title: "Online Devices",
            value: dashboard.online_devices,
            icon: <FaBroadcastTower size={32} />,
            color: "#16a34a"
        },

        {
            title: "Telemetry Records",
            value: dashboard.telemetry_records,
            icon: <FaChartLine size={32} />,
            color: "#9333ea"
        }

    ];

    return (

        <div style={{ padding: "30px", color: "white" }}>

            <h1
                style={{
                    marginBottom: "30px",
                    fontSize: "48px",
                    fontWeight: "700"
                }}
            >
                Dashboard Overview
            </h1>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: "20px"
                }}
            >

                {cards.map((card) => (

                    <div
                        key={card.title}
                        style={{
                            background: "#1e293b",
                            borderRadius: "14px",
                            padding: "25px",
                            borderLeft: `6px solid ${card.color}`,
                            transition: "0.3s",
                            cursor: "pointer"
                        }}
                    >

                        <div
                            style={{
                                color: card.color,
                                marginBottom: "15px"
                            }}
                        >
                            {card.icon}
                        </div>

                        <p
                            style={{
                                color: "#94a3b8",
                                margin: 0,
                                fontSize: "15px"
                            }}
                        >
                            {card.title}
                        </p>

                        <h1
                            style={{
                                marginTop: "10px",
                                marginBottom: 0,
                                fontSize: "38px"
                            }}
                        >
                            {card.value}
                        </h1>

                    </div>

                ))}

            </div>

            {/* Temperature Chart */}

            <div
                style={{
                    marginTop: "30px",
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "20px"
                }}
            >

                <h2>Temperature Trends</h2>
<TemperatureChart />

<div style={{ marginTop: "30px" }}>
    <ActiveAlerts />
</div>

<div style={{ marginTop: "30px" }}>
    <AlertSummary />
</div>

            </div>

            

            


        </div>

    );

}

export default Dashboard;