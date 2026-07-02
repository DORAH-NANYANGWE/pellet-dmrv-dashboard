import { useEffect, useState } from "react";

import FleetTable from "../components/FleetTable";
import StoveMap from "../components/StoveMap";
import TemperatureChart from "../components/TemperatureChart";

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

        // Load immediately
        loadDashboard();

        // Refresh every 30 seconds
        const interval = setInterval(() => {

            loadDashboard();

        }, 30000);

        // Cleanup
        return () => clearInterval(interval);

    }, []);

    if (loading) {

        return (
            <div
                style={{
                    color: "white",
                    padding: "30px"
                }}
            >
                Loading Dashboard...
            </div>
        );

    }

    const cards = [

        {
            title: "Total Users",
            value: dashboard.total_users
        },

        {
            title: "Total Stoves",
            value: dashboard.total_stoves
        },

        {
            title: "Online Devices",
            value: dashboard.online_devices
        },

        {
            title: "Telemetry Records",
            value: dashboard.telemetry_records
        }

    ];

    return (

        <div style={{ padding: "30px", color: "white" }}>

            <h1 style={{ marginBottom: "30px" }}>
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
                            borderRadius: "12px",
                            padding: "24px"
                        }}
                    >

                        <h3>{card.title}</h3>

                        <h2>{card.value}</h2>

                    </div>

                ))}

            </div>

            <div
                style={{
                    marginTop: "30px",
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "20px",
                    height: "300px"
                }}
            >

                <h2>Temperature Trends</h2>

                <TemperatureChart />

            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                    marginTop: "30px"
                }}
            >

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <FleetTable />

                </div>

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <StoveMap />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;