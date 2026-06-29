
import FleetTable from "../Components/FleetTable";
import StoveMap from "../Components/StoveMap";
import TemperatureChart from "../Components/TemperatureChart";
function Dashboard() {
  const cards = [
    { title: "Total Stoves", value: "1,250" },
    { title: "Active Today", value: "1,142" },
    { title: "Cooking Events", value: "3,486" },
    { title: "CO₂ Reduced", value: "58.2 t" }
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