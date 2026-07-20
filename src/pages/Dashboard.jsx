import { useEffect, useState } from "react";

import FleetStats from "../Components/FleetStats";
import FleetMap from "../Components/FleetMap";
import TemperatureChart from "../Components/TemperatureChart";
import ActiveAlerts from "../Components/ActiveAlerts";
import AlertSummary from "../Components/AlertSummary";

import { getDashboardSummary } from "../services/dashboardService";
import { getFleet } from "../services/fleetService";

function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [stoves, setStoves] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadDashboard() {

        try {

            const [summary, fleet] = await Promise.all([
                getDashboardSummary(),
                getFleet()
            ]);

            setDashboard(summary);
            setStoves(fleet);

        } catch (error) {

            console.error("Dashboard Error:", error);

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

            <div
                style={{
                    color: "white",
                    padding: "30px",
                    fontSize: "18px"
                }}
            >
                Loading Dashboard...
            </div>

        );

    }

    return (

        <div
            style={{
                padding: "30px",
                color: "white"
            }}
        >

            <h1
                style={{
                    marginBottom: "30px",
                    fontSize: "42px",
                    fontWeight: "700"
                }}
            >
                Dashboard Overview
            </h1>

            <FleetStats
                total={dashboard.total_stoves}
                online={dashboard.online_devices}
                offline={dashboard.offline_devices}
                averageTemperature={dashboard.average_temperature}
                lowBattery={dashboard.low_battery}
                alerts={dashboard.active_alerts}
            />

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr",
                    gap: "25px",
                    marginTop: "30px",
                    marginBottom: "30px"
                }}
            >

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        Temperature Trends
                    </h2>

                    <TemperatureChart />

                </div>

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "20px"
                        }}
                    >
                        Fleet Map
                    </h2>

                    <FleetMap stoves={stoves} />

                </div>

            </div>
                        <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "25px"
                }}
            >

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <ActiveAlerts />

                </div>

                <div
                    style={{
                        background: "#1e293b",
                        borderRadius: "12px",
                        padding: "20px"
                    }}
                >

                    <AlertSummary />

                </div>

            </div>

        </div>

    );

}

export default Dashboard;