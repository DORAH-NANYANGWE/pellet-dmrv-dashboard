import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "240px",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#111827"
        }}
      >
        <Topbar />
        <Dashboard />
      </div>
    </div>
  );
}

export default App;