import {Navigate, Route, Routes} from "react-router";
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardProfesor from "./pages/DashboardProfesor";
import DashboardAlumno from "./pages/DashboardAlumno";

function App() {
  return (
    <Routes>

    <Route path="/" element={<Navigate to="/login" replace />} />

    <Route path="/login" element={<Login />} />

    <Route
        path="/dashboard/admin"
        element={<DashboardAdmin />}
    />

    <Route
        path="/dashboard/profesor"
        element={<DashboardProfesor />}
    />

    <Route
        path="/dashboard/alumno"
        element={<DashboardAlumno />}
    />

    <Route path="*" element={<Navigate to="/login" replace />} />

</Routes>
  );
}

export default App