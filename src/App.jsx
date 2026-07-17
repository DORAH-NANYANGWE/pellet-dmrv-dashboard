import {
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import UserManagement from "./Pages/UserManagement";
import Fleet from "./Pages/Fleet";
import Sidebar from "./Components/Sidebar";
import Topbar from "./Components/Topbar";
import ProtectedRoute from "./Components/ProtectedRoute";
import RoleProtectedRoute from "./Components/RoleProtectedRoute";
import StoveDetail from "./Pages/StoveDetail";
import CookingSessions from "./Pages/CookingSessions";


function DashboardLayout() {

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

                <Outlet />

            </main>

        </div>

    );

}

function App() {

    return (

        <Routes>

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >

                <Route
    path="/dashboard"
    element={<Dashboard />}
/>

<Route
    path="/fleet"
    element={<Fleet />}
/>
<Route
    path="/cooking-sessions"
    element={<CookingSessions />}
/>

<Route
    path="/fleet/:deviceCode"
    element={<StoveDetail />}
/>

<Route
    path="/users"
    element={
        <RoleProtectedRoute
            allowedRoles={["Administrator"]}
        >
            <UserManagement />
        </RoleProtectedRoute>
    }
/>
                    
                

            </Route>

        </Routes>

    );

}

export default App;