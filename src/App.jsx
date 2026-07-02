import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import Dashboard from "./Pages/Dashboard";

function App() {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#111827"
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          minWidth: 0,
          backgroundColor: "#111827"
        }}
      >
        <Topbar />
        <Dashboard />
      </main>
    </div>
  );
}

export default App;