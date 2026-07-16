import StatCard from "./StatCard";

function FleetStats({

    total,
    online,
    offline,
    averageTemperature,
    lowBattery,
    alerts

}) {

    return (

        <div
            style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginBottom: "30px"
            }}
        >

            <StatCard
                title="Total Stoves"
                value={total}
                color="#3b82f6"
            />

            <StatCard
                title="Online"
                value={online}
                color="#22c55e"
            />

            <StatCard
                title="Offline"
                value={offline}
                color="#ef4444"
            />

            <StatCard
                title="Avg Temp"
                value={`${averageTemperature} °C`}
                color="#f59e0b"
            />

            <StatCard
                title="Low Battery"
                value={lowBattery}
                color="#eab308"
            />

            <StatCard
                title="Alerts"
                value={alerts}
                color="#dc2626"
            />

        </div>

    );

}

export default FleetStats;