import { useEffect, useState } from "react";
import { getReportsSummary } from "../services/reportsService";

function SummaryCard({ title, value, color }) {

    return (

        <div
            style={{
                background: "#1e293b",
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
            }}
        >

            <div
                style={{
                    color: "#94a3b8",
                    fontSize: "14px",
                    marginBottom: "12px"
                }}
            >
                {title}
            </div>

            <div
                style={{
                    color,
                    fontSize: "34px",
                    fontWeight: "bold"
                }}
            >
                {value}
            </div>

        </div>

    );

}

function ReportsSummary() {

    const [summary, setSummary] = useState(null);

    const [loading, setLoading] = useState(true);

    async function loadSummary() {

        try {

            const data = await getReportsSummary();

            setSummary(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadSummary();

    }, []);

    if (loading) {

        return (

            <p
                style={{
                    color: "white"
                }}
            >
                Loading report summary...
            </p>

        );

    }

    return (

        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px"
            }}
        >

            <SummaryCard
                title="Total Stoves"
                value={summary.total_stoves}
                color="#ffffff"
            />

            <SummaryCard
                title="Online Devices"
                value={summary.online_devices}
                color="#22c55e"
            />

            <SummaryCard
                title="Offline Devices"
                value={summary.offline_devices}
                color="#ef4444"
            />

            <SummaryCard
                title="Active Alerts"
                value={summary.active_alerts}
                color="#f59e0b"
            />

        </div>

    );

}

export default ReportsSummary;