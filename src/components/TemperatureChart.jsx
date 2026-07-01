import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

import { useEffect, useState } from "react";

import { getTemperatureChart } from "../services/telemetryService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function TemperatureChart() {

    const [chartData, setChartData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadChart() {

            try {

                const data = await getTemperatureChart();

                setChartData(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        loadChart();

    }, []);

    if (loading) {

        return <p style={{ color: "white" }}>Loading chart...</p>;

    }

    const data = {

        labels: chartData.map(item => item.time),

        datasets: [

            {

                label: "Temperature (°C)",

                data: chartData.map(item => item.temperature),

                borderColor: "#4ade80",

                backgroundColor: "#4ade80",

                tension: 0.4

            }

        ]

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                labels: {

                    color: "white"

                }

            }

        },

        scales: {

            x: {

                ticks: {

                    color: "white"

                }

            },

            y: {

                ticks: {

                    color: "white"

                }

            }

        }

    };

    return <Line data={data} options={options} />;

}

export default TemperatureChart;