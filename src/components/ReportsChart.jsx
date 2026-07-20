import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { getTemperatureReport } from "../services/reportsService";

function ReportsChart() {

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    async function loadChart() {

        try {

            const data = await getTemperatureReport();

            setChartData(data);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        loadChart();

    }, []);

    if (loading) {

        return (

            <div
                style={{
                    background: "#1e293b",
                    borderRadius: "12px",
                    padding: "25px",
                    color: "white"
                }}
            >
                Loading temperature trend...
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
                    marginBottom: "25px",
                    color: "white",
                    fontSize: "24px",
                    fontWeight: "600"
                }}
            >
                Average Daily Stove Temperature
            </h2>

            <div
                style={{
                    width: "100%",
                    height: "380px"
                }}
            >

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 10,
                            bottom: 10
                        }}
                    >

                        <CartesianGrid
                            stroke="#475569"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{
                                fill: "#94a3b8"
                            }}
                        />

                        <YAxis
                            domain={["dataMin - 10", "dataMax + 10"]}
                            unit="°C"
                            stroke="#94a3b8"
                            tick={{
                                fill: "#94a3b8"
                            }}
                        />

                        <Tooltip

                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "1px solid #334155",
                                borderRadius: "8px",
                                color: "white"
                            }}

                            labelStyle={{
                                color: "#ffffff",
                                fontWeight: "bold"
                            }}

                            formatter={(value) => [
                                `${value} °C`,
                                "Average Temperature"
                            ]}

                        />

                        <Line

                            type="monotone"

                            dataKey="average_temperature"

                            stroke="#3b82f6"

                            strokeWidth={3}

                            dot={{
                                r: 5,
                                fill: "#3b82f6"
                            }}

                            activeDot={{
                                r: 8
                            }}

                            isAnimationActive={true}

                            animationDuration={800}

                        />

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default ReportsChart;