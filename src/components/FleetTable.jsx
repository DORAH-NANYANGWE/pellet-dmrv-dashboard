function FleetTable() {
  const stoves = [
    {
      id: "STV001",
      status: "🟢 Online",
      temp: "285°C",
      battery: "4.1V",
      lastSeen: "2 min ago"
    },
    {
      id: "STV002",
      status: "🟢 Online",
      temp: "270°C",
      battery: "4.0V",
      lastSeen: "1 min ago"
    },
    {
      id: "STV003",
      status: "🔴 Offline",
      temp: "--",
      battery: "--",
      lastSeen: "5 hrs ago"
    },
    {
      id: "STV004",
      status: "🟢 Online",
      temp: "250°C",
      battery: "3.9V",
      lastSeen: "30 sec ago"
    }
  ];

  return (
    <div>
      <h2>Fleet Status</h2>

      <table
        style={{
          width: "100%",
          color: "white",
          borderCollapse: "collapse",
          fontSize: "14px"
        }}
      >
        <thead>
          <tr style={{ borderBottom: "1px solid #334155" }}>
            <th style={{ padding: "10px", textAlign: "left" }}>Stove</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Status</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Temp</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Battery</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Last Seen</th>
          </tr>
        </thead>

        <tbody>
          {stoves.map((stove) => (
            <tr key={stove.id}>
              <td style={{ padding: "8px" }}>{stove.id}</td>
              <td style={{ padding: "8px" }}>{stove.status}</td>
              <td style={{ padding: "8px" }}>{stove.temp}</td>
              <td style={{ padding: "8px" }}>{stove.battery}</td>
              <td style={{ padding: "8px" }}>{stove.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FleetTable;