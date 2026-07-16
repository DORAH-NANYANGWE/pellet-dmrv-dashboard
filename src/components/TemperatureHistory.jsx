import { useEffect, useState } from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

import { getTemperatureHistory } from "../services/fleetService";

function TemperatureHistory({ deviceCode }) {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        async function loadHistory() {

            try {

                const data = await getTemperatureHistory(deviceCode);

                console.log(data);

                setHistory(data);

            } catch (err) {

                console.error(err);

            }

        }

        loadHistory();

    }, [deviceCode]);

    return (

        <div
            style={{
                background: "#1e293b",
                padding: "25px",
                borderRadius: "12px",
                marginTop: "30px",
                width: "100%"
            }}
        >

            <h3
                style={{
                    color: "white",
                    marginBottom: "20px"
                }}
            >
                📈 Temperature History
            </h3>

            <div
                style={{
                    width: "100%",
                    height: "350px"
                }}
            >

                <ResponsiveContainer width="100%" height="100%">

                    <LineChart data={history}>

                        <CartesianGrid stroke="#334155" />

                        <XAxis
                            dataKey="timestamp"
                            stroke="#cbd5e1"
                        />

                        <YAxis
                            stroke="#cbd5e1"
                        />

                        <Tooltip />

                        <Line
    type="monotone"
    dataKey="temperature"
    stroke="#ef4444"
    strokeWidth={4}
    dot={{
        r: 6,
        stroke: "#ef4444",
        strokeWidth: 2,
        fill: "#ffffff"
    }}
    activeDot={{
        r: 8
    }}
/>

                    </LineChart>

                </ResponsiveContainer>

            </div>

        </div>

    );

}

export default TemperatureHistory;